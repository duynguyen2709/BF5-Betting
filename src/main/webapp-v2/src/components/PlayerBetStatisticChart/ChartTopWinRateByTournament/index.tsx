import { BET_RESULT } from '@/constants';
import type { BetHistory } from '@/types';
import { filterBetResult, groupBetHistoriesByTournament } from '@/utils/betHistory';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ChartTitle } from '../ChartTitle';

interface TournamentWinRate {
  tournament: string;
  winRate: number;
  totalWin: number;
  totalLost: number;
  totalBet: number;
}

interface ChartTopWinRateByTournamentProps {
  data: BetHistory[];
  title: string;
}

function calculateTopWinRateByTournament(
  betGroupByTournament: Record<string, BetHistory[]> | null
): TournamentWinRate[] {
  if (!betGroupByTournament) {
    return [];
  }

  const data: TournamentWinRate[] = [];
  Object.entries(betGroupByTournament).forEach(([tournament, group]) => {
    const totalBet = group.length;
    const totalWin = filterBetResult(group, [BET_RESULT.Win, BET_RESULT.HalfWin]).length;
    const totalLost = filterBetResult(group, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length;
    const winRate = Math.round((totalWin / totalBet) * 100);

    data.push({
      tournament,
      winRate,
      totalWin,
      totalLost,
      totalBet,
    });
  });

  return data.sort((a, b) => b.totalBet - a.totalBet).slice(0, 5);
}

export const ChartTopWinRateByTournament: React.FC<ChartTopWinRateByTournamentProps> = ({
  data,
  title,
}) => {
  const topWinRateByTournament = React.useMemo(() => {
    const betGroupByTournament = groupBetHistoriesByTournament(data);
    return calculateTopWinRateByTournament(betGroupByTournament);
  }, [data]);

  if (!topWinRateByTournament.length) {
    return null;
  }

  const yMax =
    Math.max(...topWinRateByTournament.map((item) => Math.max(item.totalWin, item.totalLost))) + 1;

  const chartData = {
    series: [
      {
        name: 'Thắng',
        type: 'column',
        data: topWinRateByTournament.map((item) => item.totalWin),
      },
      {
        name: 'Thua',
        type: 'column',
        data: topWinRateByTournament.map((item) => item.totalLost),
      },
      {
        name: 'Tỉ Lệ Thắng',
        type: 'line',
        data: topWinRateByTournament.map((item) => item.winRate),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          speed: 200,
        },
        parentHeightOffset: 0,
        background: '#ffffff',
        selection: {
          enabled: false,
        },
        type: 'line',
        stacked: false,
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          opacity: 0.8,
        },
      },
      stroke: {
        width: [0, 0, 3],
        curve: 'smooth',
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [2],
        formatter: function (val: number, opts) {
          if (opts.seriesIndex === 2) return `${val}%`;
          return '';
        },
        style: {
          fontSize: '12px',
        },
        offsetY: -10,
      },
      xaxis: {
        categories: topWinRateByTournament.map((item) => item.tournament.split(' ')),
        labels: {
          style: {
            fontSize: '11px',
            fontWeight: 500,
            colors: ['#262626'],
          },
          rotate: 0,
          rotateAlways: false,
          trim: false,
        },
        axisBorder: {
          show: true,
          color: '#237804',
        },
      },
      yaxis: [
        {
          seriesName: 'Thắng',
          min: 0,
          max: yMax,
          labels: {
            formatter: (val: number) => Math.round(val).toString(),
            style: {
              fontSize: '12px',
              fontWeight: 500,
            },
          },
        },
        {
          seriesName: 'Thua',
          show: false,
          min: 0,
          max: yMax,
          tickAmount: yMax,
        },
        {
          opposite: true,
          min: 0,
          max: 100,
          tickAmount: 5,
          labels: {
            formatter: (val: number) => `${val}%`,
            style: {
              fontSize: '12px',
              fontWeight: 500,
            },
            offsetX: -25,
          },
        },
      ],
      markers: {
        size: 6,
        strokeWidth: 2,
      },
      tooltip: {
        enabled: false,
      },
      grid: {
        show: true,
        borderColor: '#f0f0f0',
        strokeDashArray: 3,
        position: 'back',
        xaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          right: -40,
          left: 10,
          top: 25,
        },
      },
      colors: ['#00b96b', '#ff4d4f', '#1890ff'],
      legend: {
        clusterGroupedSeries: false,
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        floating: true,
        fontSize: '13px',
        fontWeight: 500,
        itemMargin: {
          horizontal: 16,
          vertical: 0,
        },
        onItemClick: {
          toggleDataSeries: false,
        },
        markers: {
          offsetX: -4,
        },
      },
    } as ApexOptions,
  };

  return (
    <>
      <ChartTitle text={title} />
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={360}
      />
    </>
  );
};

export default ChartTopWinRateByTournament;
