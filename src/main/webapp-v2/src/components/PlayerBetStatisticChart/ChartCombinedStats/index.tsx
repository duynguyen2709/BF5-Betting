import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

import { ChartTitle } from '../ChartTitle';

import type { AssetByDate, BetHistory } from '@/types';

import { BET_RESULT } from '@/constants';
import { PaymentAction } from '@/constants/enums';
import { filterBetResult, groupBetHistoriesByDate } from '@/utils/betHistory';
import { PaymentHistoryActionTable } from './PaymentHistoryActionTable';

const COLORS = {
  asset: '#1677ff',
  winRate: '#00b96b',
  border: '#237804',
} as const;

interface DateWinRate {
  date: string;
  winRate: number | undefined;
}

function calculateWinRateByDate(
  betGroupByDate: Record<string, BetHistory[]> | null
): DateWinRate[] {
  if (!betGroupByDate) {
    return [];
  }

  const data: DateWinRate[] = [];
  Object.entries(betGroupByDate).forEach(([date, group]) => {
    const totalBet = group.length;
    const totalWin = filterBetResult(group, [BET_RESULT.Win, BET_RESULT.HalfWin]).length;
    const totalDraw = filterBetResult(group, [BET_RESULT.Draw]).length;
    const totalUnfinished = filterBetResult(group, [BET_RESULT.Unfinished]).length;
    const totalWithoutDraw = group.length - totalDraw - totalUnfinished;
    const winRate =
      totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined;

    if (totalUnfinished < totalBet) {
      data.push({ date, winRate });
    }
  });
  return data;
}

interface ChartCombinedStatsProps {
  assetData: AssetByDate[];
  betData: BetHistory[];
  title: string;
}

export const ChartCombinedStats: React.FC<ChartCombinedStatsProps> = ({
  assetData,
  betData,
  title,
}) => {
  if (assetData.length === 0) {
    return null;
  }

  const betGroupByDate = groupBetHistoriesByDate(betData);
  const winRateByDate = calculateWinRateByDate(betGroupByDate);

  const cashoutActions = assetData.filter(
    (ele) => ele.action === PaymentAction.CASHOUT || ele.action === PaymentAction.DEPOSIT
  );

  const chartData = useMemo(() => {
    const maxDataPoints = 50;
    const showMarkers = assetData.length <= 4;

    if (assetData.length <= maxDataPoints) {
      return {
        categories: assetData.map((ele) => ele.paymentTime.substring(0, 5)),
        assets: assetData.map((ele) => ele.assetAfter),
        winRates: winRateByDate.map((ele) => ele.winRate || 0),
        showMarkers,
      };
    }

    // Calculate step size to reduce data points
    const step = Math.ceil(assetData.length / maxDataPoints);
    const sampledData = assetData.filter((_, index) => index % step === 0);
    const sampledWinRates = winRateByDate.filter((_, index) => index % step === 0);

    return {
      categories: sampledData.map((ele) => ele.paymentTime.substring(0, 5)),
      assets: sampledData.map((ele) => ele.assetAfter),
      winRates: sampledWinRates.map((ele) => ele.winRate || 0),
      showMarkers,
    };
  }, [assetData, winRateByDate]);

  return (
    <>
      <ChartTitle text={title} />
      <Chart
        options={{
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
          },
          xaxis: {
            categories: chartData.categories,
            tickAmount: 5,
            labels: {
              style: {
                fontSize: '12px',
                fontWeight: 500,
                colors: ['#262626'],
              },
              offsetX: 2,
              offsetY: 2,
              trim: false,
              hideOverlappingLabels: false,
              formatter: (value: string) => value?.replace(' ', '\n') || value,
              datetimeUTC: false,
            },
            axisBorder: {
              show: true,
              color: COLORS.border,
            },
            axisTicks: {
              show: false,
            },
            crosshairs: {
              show: false,
            },
          },
          yaxis: [
            {
              labels: {
                formatter: (value: number) => {
                  const absoluteValue = Math.abs(value);
                  let formattedValue = '';

                  if (absoluteValue >= 1000000) {
                    formattedValue = `${(absoluteValue / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
                  } else if (absoluteValue >= 1000) {
                    formattedValue = `${(absoluteValue / 1000).toFixed(1).replace(/\.0$/, '')}K`;
                  } else {
                    formattedValue = absoluteValue.toString();
                  }

                  return value < 0 ? `-${formattedValue}` : `+${formattedValue}`;
                },
                style: {
                  fontSize: '12px',
                  fontWeight: 500,
                },
                minWidth: 40,
                offsetX: -10,
              },
              forceNiceScale: true,
              tickAmount: 6,
              showAlways: true,
            },
            {
              opposite: true,
              min: 0,
              max: 100,
              labels: {
                formatter: (val: number) => `${val}%`,
                style: {
                  fontSize: '12px',
                  fontWeight: 500,
                },
                offsetX: -25,
              },
              tickAmount: 5,
              showAlways: true,
            },
          ],
          stroke: {
            curve: 'smooth',
            width: [2, 3],
            lineCap: 'round',
            dashArray: [3, 0],
          },
          colors: [COLORS.asset, COLORS.winRate],
          tooltip: {
            enabled: false,
          },
          legend: {
            position: 'top',
            horizontalAlign: 'center',
            fontSize: '13px',
            fontWeight: 500,
            itemMargin: {
              horizontal: 24,
            },
            showForSingleSeries: true,
            onItemClick: {
              toggleDataSeries: false,
            },
            markers: {
              offsetX: -4,
            },
            offsetY: -5,
            floating: true,
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
              right: -10,
              top: 10,
            },
          },
          markers: {
            size: chartData.showMarkers ? 6 : 0,
            strokeWidth: 2,
            hover: {
              size: 8,
            },
          },
          forecastDataPoints: {
            count: 0,
          },
        }}
        series={[
          {
            name: 'Tài Sản',
            type: 'line',
            data: chartData.assets,
          },
          {
            name: 'Tỉ Lệ Thắng',
            type: 'line',
            data: chartData.winRates,
          },
        ]}
        type="line"
        height={360}
        width="100%"
      />
      {cashoutActions.length > 0 && <PaymentHistoryActionTable cashoutActions={cashoutActions} />}
    </>
  );
};
