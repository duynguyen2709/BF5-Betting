import { Divider } from 'antd'
import React from 'react'
import Chart from 'react-apexcharts'

import { ChartTitle } from '../ChartTitle'

import type { BetHistory } from '@/types'

import { BET_RESULT } from '@/constants'
import { filterBetResult, groupBetHistoriesByTournament } from '@/utils/betHistory'

interface TournamentWinRate {
  tournament: string
  winRate: number | undefined
  totalWin: number
  totalLost: number
  totalBet: number
}

function calculateTopWinRateByTournament(
  betGroupByTournament: Record<string, BetHistory[]> | null
): TournamentWinRate[] {
  if (!betGroupByTournament) {
    return []
  }

  const data: TournamentWinRate[] = []
  Object.entries(betGroupByTournament).forEach(([tournament, group]) => {
    const totalBet = group.length
    const totalWin = filterBetResult(group, [BET_RESULT.Win, BET_RESULT.HalfWin]).length
    const totalLost = filterBetResult(group, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length
    const totalDraw = filterBetResult(group, [BET_RESULT.Draw]).length
    const totalUnfinished = filterBetResult(group, [BET_RESULT.Unfinished]).length
    const totalWithoutDraw = group.length - totalDraw - totalUnfinished
    const winRate = totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined

    if (totalUnfinished < totalBet) {
      data.push({ tournament, winRate, totalWin, totalLost, totalBet })
    }
  })
  data.sort((a, b) => b.totalBet - a.totalBet)
  return data.slice(0, 5)
}

interface ChartTopWinRateByTournamentProps {
  data: BetHistory[]
  title: string
  width?: string | number
}

export const ChartTopWinRateByTournament: React.FC<ChartTopWinRateByTournamentProps> = ({
  data,
  title,
  width = '350'
}) => {
  const betGroupByTournament = groupBetHistoriesByTournament(data)
  const topWinRateByTournament = calculateTopWinRateByTournament(betGroupByTournament)

  if (topWinRateByTournament.length === 0) {
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
            categories: topWinRateByTournament.map((ele) => ele.tournament),
            labels: {
              formatter: (val: string) => {
                const tournament = topWinRateByTournament.find((ele) => ele.tournament === val)
                return `${val} (${tournament?.totalBet})`
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
            data: topWinRateByTournament.map((ele) => ele.winRate || 0)
          }
        ]}
        type='bar'
        width={width}
      />
      <Divider />
    </>
  )
}
