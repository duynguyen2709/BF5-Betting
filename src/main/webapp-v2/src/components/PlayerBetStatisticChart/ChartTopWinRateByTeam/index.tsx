import { BET_RESULT } from '@/constants';
import type { BetHistory } from '@/types';
import { filterBetResult, groupBetHistoriesByTeam } from '@/utils/betHistory';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ChartTitle } from '../ChartTitle';

interface TeamWinRate {
  team: string;
  winRate: number | undefined;
  totalWin: number;
  totalLost: number;
  totalBet: number;
}

interface ChartTopWinRateByTeamProps {
  data: BetHistory[];
  title: string;
}

function calculateTopWinRateByTeam(
  betGroupByTeam: Record<string, BetHistory[]> | null
): TeamWinRate[] {
  if (!betGroupByTeam) {
    return [];
  }

  const data: TeamWinRate[] = [];
  Object.entries(betGroupByTeam).forEach(([team, group]) => {
    const totalBet = group.length;
    const totalWin = filterBetResult(group, [BET_RESULT.Win, BET_RESULT.HalfWin]).length;
    const totalLost = filterBetResult(group, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length;
    const totalDraw = filterBetResult(group, [BET_RESULT.Draw]).length;
    const totalUnfinished = filterBetResult(group, [BET_RESULT.Unfinished]).length;
    const totalWithoutDraw = group.length - totalDraw - totalUnfinished;
    const winRate =
      totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined;

    if (totalUnfinished < totalBet) {
      data.push({ team, winRate, totalWin, totalLost, totalBet });
    }
  });
  data.sort((a, b) => b.totalBet - a.totalBet);
  return data.slice(0, 5);
}

export const ChartTopWinRateByTeam: React.FC<ChartTopWinRateByTeamProps> = ({ data, title }) => {
  const topWinRateByTeam = React.useMemo(() => {
    const betGroupByTeam = groupBetHistoriesByTeam(data);
    return calculateTopWinRateByTeam(betGroupByTeam);
  }, [data]);

  if (!topWinRateByTeam.length) {
    return null;
  }

  const yMax =
    Math.max(...topWinRateByTeam.map((item) => Math.max(item.totalWin, item.totalLost))) + 1;

  const chartData = {
    series: [
      {
        name: 'Thắng',
        type: 'column',
        data: topWinRateByTeam.map((item) => item.totalWin),
      },
      {
        name: 'Thua',
        type: 'column',
        data: topWinRateByTeam.map((item) => item.totalLost),
      },
      {
        name: 'Tỉ Lệ Thắng',
        type: 'line',
        data: topWinRateByTeam.map((item) => item.winRate || 0),
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
          dataLabels: {
            position: 'top',
          },
        },
      },
      stroke: {
        width: [0, 0, 3],
        curve: 'smooth',
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts) {
          if (opts.seriesIndex === 2) return `${val}%`;
          return '';
        },
        style: {
          fontSize: '12px',
        },
        offsetY: -10,
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
      xaxis: {
        categories: topWinRateByTeam.map((item) => item.team.split(' ')),
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
          tickAmount: Math.min(5, yMax),
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
      colors: ['#00b96b', '#ff4d4f', '#1890ff'],
      legend: {
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

export default ChartTopWinRateByTeam;
