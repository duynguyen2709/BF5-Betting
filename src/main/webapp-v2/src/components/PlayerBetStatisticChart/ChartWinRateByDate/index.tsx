import { Divider } from 'antd'
import React from 'react'
import Chart from 'react-apexcharts'

import { ChartTitle } from '../ChartTitle'

import type { BetHistory } from '@/types'

import { BET_RESULT } from '@/constants'
import { filterBetResult, groupBetHistoriesByDate } from '@/utils/betHistory'

interface DateWinRate {
  date: string
  winRate: number | undefined
}

function calculateWinRateByDate(betGroupByDate: Record<string, BetHistory[]> | null): DateWinRate[] {
  if (!betGroupByDate) {
    return []
  }

  const data: DateWinRate[] = []
  Object.entries(betGroupByDate).forEach(([date, group]) => {
    const totalBet = group.length
    const totalWin = filterBetResult(group, [BET_RESULT.Win, BET_RESULT.HalfWin]).length
    const totalDraw = filterBetResult(group, [BET_RESULT.Draw]).length
    const totalUnfinished = filterBetResult(group, [BET_RESULT.Unfinished]).length
    const totalWithoutDraw = group.length - totalDraw - totalUnfinished
    const winRate = totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined

    if (totalUnfinished < totalBet) {
      data.push({ date, winRate })
    }
  })
  return data
}

interface ChartWinRateByDateProps {
  data: BetHistory[]
  title: string
  width?: string | number
}

export const ChartWinRateByDate: React.FC<ChartWinRateByDateProps> = ({ data, title, width = '350' }) => {
  const betGroupByDate = groupBetHistoriesByDate(data)
  const winRateByDate = calculateWinRateByDate(betGroupByDate)

  if (winRateByDate.length === 0) {
    return null
  }

  return (
    <>
      <ChartTitle text={title} />
      <Chart
        options={{
          chart: {
            toolbar: {
              show: false
            }
          },
          xaxis: {
            categories: winRateByDate.map((ele) => ele.date),
            tickAmount: winRateByDate.length > 6 ? winRateByDate.length / 3 : winRateByDate.length
          },
          yaxis: {
            min: 0,
            max: 100,
            labels: {
              formatter: (val: number) => `${val}%`
            }
          },
          stroke: {
            curve: 'smooth'
          },
          colors: ['#237804'],
          tooltip: {
            y: {
              formatter: (val: number) => `${val}%`
            }
          }
        }}
        series={[
          {
            name: 'Tỉ Lệ Thắng',
            data: winRateByDate.map((ele) => ele.winRate || 0)
          }
        ]}
        type='line'
        width={width}
      />
      <Divider />
    </>
  )
}
