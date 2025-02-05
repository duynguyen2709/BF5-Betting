import { Divider } from 'antd'
import React from 'react'
import Chart from 'react-apexcharts'

import { ChartTitle } from '../ChartTitle'

import type { BetHistory } from '@/types'

import { BET_RESULT } from '@/constants'
import { filterBetResult, groupBetHistoriesByTeam } from '@/utils/betHistory'

interface TeamWinRate {
  team: string
  winRate: number | undefined
  totalWin: number
  totalLost: number
  totalBet: number
}

function calculateTopWinRateByTeam(betGroupByTeam: Record<string, BetHistory[]> | null): TeamWinRate[] {
  if (!betGroupByTeam) {
    return []
  }

  const data: TeamWinRate[] = []
  Object.entries(betGroupByTeam).forEach(([team, group]) => {
    const totalBet = group.length
    const totalWin = filterBetResult(group, [BET_RESULT.Win, BET_RESULT.HalfWin]).length
    const totalLost = filterBetResult(group, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length
    const totalDraw = filterBetResult(group, [BET_RESULT.Draw]).length
    const totalUnfinished = filterBetResult(group, [BET_RESULT.Unfinished]).length
    const totalWithoutDraw = group.length - totalDraw - totalUnfinished
    const winRate = totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined

    if (totalUnfinished < totalBet) {
      data.push({ team, winRate, totalWin, totalLost, totalBet })
    }
  })
  data.sort((a, b) => b.totalBet - a.totalBet)
  return data.slice(0, 5)
}

interface ChartTopWinRateByTeamProps {
  data: BetHistory[]
  title: string
  width?: string | number
}

export const ChartTopWinRateByTeam: React.FC<ChartTopWinRateByTeamProps> = ({ data, title, width = '350' }) => {
  const betGroupByTeam = groupBetHistoriesByTeam(data)
  const topWinRateByTeam = calculateTopWinRateByTeam(betGroupByTeam)

  if (topWinRateByTeam.length === 0) {
    return null
  }

  return (
    <>
      <ChartTitle text={title} />
      <Chart
        options={{
          chart: {
            type: 'bar',
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: 'top'
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val}%`,
            offsetX: 30
          },
          xaxis: {
            categories: topWinRateByTeam.map((ele) => ele.team),
            labels: {
              formatter: (val: string) => {
                const team = topWinRateByTeam.find((ele) => ele.team === val)
                return `${val} (${team?.totalBet})`
              }
            }
          },
          yaxis: {
            min: 0,
            max: 100
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
            data: topWinRateByTeam.map((ele) => ele.winRate || 0)
          }
        ]}
        type='bar'
        width={width}
      />
      <Divider />
    </>
  )
}
