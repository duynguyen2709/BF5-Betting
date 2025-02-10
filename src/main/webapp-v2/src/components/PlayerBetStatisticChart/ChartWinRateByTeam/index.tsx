import { Col, Row, Select } from 'antd';
import React, { useCallback, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';

import { ChartTitle } from '../ChartTitle';
import styles from './index.module.css';

import type { BetHistory } from '@/types';

import { BET_RESULT } from '@/constants';
import { filterBetResult, getDistinctTeamName } from '@/utils/betHistory';
import { ApexOptions } from 'apexcharts';

interface WinRate {
  winRate: number | undefined;
  totalWin: number;
  totalLost: number;
  totalDraw: number;
  totalUnfinished: number;
}

function calculateWinRateOfSingleTeam(betHistoryList: BetHistory[], team: string): WinRate {
  const betsOfTeam: any[] = [];
  for (const bet of betHistoryList) {
    for (const event of bet.events) {
      if (event.firstTeam === team || event.secondTeam === team) {
        betsOfTeam.push(event);
      }
    }
  }

  const totalWin = filterBetResult(betsOfTeam, [BET_RESULT.Win, BET_RESULT.HalfWin]).length;
  const totalLost = filterBetResult(betsOfTeam, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length;
  const totalDraw = filterBetResult(betsOfTeam, [BET_RESULT.Draw]).length;
  const totalUnfinished = filterBetResult(betsOfTeam, [BET_RESULT.Unfinished]).length;
  const totalWithoutDraw = betsOfTeam.length - totalDraw - totalUnfinished;
  const winRate =
    totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined;

  return { winRate, totalWin, totalLost, totalDraw, totalUnfinished };
}

interface ChartWinRateByTeamProps {
  data: BetHistory[];
  title: string;
}

export const ChartWinRateByTeam: React.FC<ChartWinRateByTeamProps> = ({ data, title }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [winRate, setWinRate] = useState<WinRate>({
    winRate: 0,
    totalWin: 0,
    totalLost: 0,
    totalDraw: 0,
    totalUnfinished: 0,
  });

  const onChangeTeam = useCallback(
    (value: string) => {
      setSelectedTeam(value);
      if (value) {
        const winRate = calculateWinRateOfSingleTeam(data, value);
        setWinRate(winRate);
      }
    },
    [data]
  );

  const handleBlur = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const teams = Array.from(getDistinctTeamName(data));
  const max =
    Math.max(winRate.totalWin, winRate.totalLost, winRate.totalDraw, winRate.totalUnfinished) + 1;

  const chartData = useMemo(() => {
    const options: ApexOptions = {
      chart: {
        id: 'win-rate-by-team-bar-chart',
        toolbar: {
          show: false,
        },
        stacked: false,
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
          top: 10,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          dataLabels: {
            position: 'top',
          },
        },
      },
      xaxis: {
        categories: [selectedTeam],
        labels: {
          style: {
            fontSize: '13px',
            fontWeight: 600,
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
      yaxis: {
        tickAmount: Math.min(5, max),
        min: 0,
        max,
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: 500,
          },
          formatter: (val: number) => Math.round(val).toString(),
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '13px',
          colors: ['#000'],
        },
        formatter: function (val: number) {
          return val > 0 ? val.toString() : '';
        },
      },
      tooltip: {
        enabled: false,
      },
      colors: ['#00b96b', '#ff4d4f', '#1890ff', '#faad14'],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        floating: true,
        offsetY: 5,
        itemMargin: {
          horizontal: 8,
          vertical: 0,
        },
        markers: {
          offsetX: -2,
        },
      },
    };
    return {
      series: [
        {
          name: 'Thắng',
          type: 'column',
          data: [winRate.totalWin],
        },
        {
          name: 'Thua',
          type: 'column',
          data: [winRate.totalLost],
        },
        {
          name: 'Hoà',
          type: 'column',
          data: [winRate.totalDraw],
        },
        {
          name: 'Chưa Hoàn Tất',
          type: 'column',
          data: [winRate.totalUnfinished],
        },
      ],
      options,
    };
  }, [selectedTeam, winRate]);

  return (
    <>
      <ChartTitle text={title} />
      <div className={styles['row-chart-win-rate-by-team']}>
        <Row
          style={{ width: '100%', height: '40px', alignItems: 'center', marginBottom: '1.5rem' }}
          justify="space-between"
        >
          <Col span={6} className={styles['label-team-select']}>
            <p>Chọn Đội:</p>
          </Col>
          <Col span={18}>
            <Select
              showSearch
              placeholder="Chọn đội"
              value={selectedTeam}
              onChange={onChangeTeam}
              style={{ width: '100%' }}
              options={teams.map((team) => ({ value: team, label: team }))}
              onSelect={handleBlur}
              onBlur={handleBlur}
            />
          </Col>
        </Row>
        {selectedTeam && (
          <Chart options={chartData.options} series={chartData.series} type="bar" height={296} />
        )}
      </div>
    </>
  );
};
