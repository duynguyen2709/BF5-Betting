import { Col, Row, Select } from 'antd'
import React, { useCallback, useState } from 'react'
import Chart from 'react-apexcharts'

import { ChartTitle } from '../ChartTitle'
import styles from './index.module.css'

import type { BetHistory } from '@/types'

import { BET_RESULT } from '@/constants'
import { filterBetResult, getDistinctTeamName } from '@/utils/betHistory'

interface WinRate {
  winRate: number | undefined
  totalWin: number
  totalLost: number
  totalDraw: number
  totalUnfinished: number
}

function calculateWinRateOfSingleTeam(betHistoryList: BetHistory[], team: string): WinRate {
  const betsOfTeam: any[] = []
  for (const bet of betHistoryList) {
    for (const event of bet.events) {
      if (event.firstTeam === team || event.secondTeam === team) {
        betsOfTeam.push(event)
      }
    }
  }

  const totalWin = filterBetResult(betsOfTeam, [BET_RESULT.Win, BET_RESULT.HalfWin]).length
  const totalLost = filterBetResult(betsOfTeam, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length
  const totalDraw = filterBetResult(betsOfTeam, [BET_RESULT.Draw]).length
  const totalUnfinished = filterBetResult(betsOfTeam, [BET_RESULT.Unfinished]).length
  const totalWithoutDraw = betsOfTeam.length - totalDraw - totalUnfinished
  const winRate = totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined

  return { winRate, totalWin, totalLost, totalDraw, totalUnfinished }
}

interface ChartWinRateByTeamProps {
  data: BetHistory[]
  title: string
}

export const ChartWinRateByTeam: React.FC<ChartWinRateByTeamProps> = ({ data, title }) => {
  const [selectedTeam, setSelectedTeam] = useState('')
  const [winRate, setWinRate] = useState<WinRate>({
    winRate: 0,
    totalWin: 0,
    totalLost: 0,
    totalDraw: 0,
    totalUnfinished: 0
  })

  const onChangeTeam = useCallback(
    (value: string) => {
      setSelectedTeam(value)
      if (value) {
        const winRate = calculateWinRateOfSingleTeam(data, value)
        setWinRate(winRate)
      }
    },
    [data]
  )

  const teams = Array.from(getDistinctTeamName(data))

  return (
    <>
      <ChartTitle text={title} />
      <Row className={styles['row-chart-win-rate-by-team']}>
        <Row style={{ width: '100%' }}>
          <Col span={6} className={styles['label-team-select']}>
            <p>Chọn Đội:</p>
          </Col>
          <Col span={18}>
            <Select
              showSearch
              allowClear={false}
              style={{ width: '100%' }}
              value={selectedTeam}
              onChange={onChangeTeam}
            >
              {teams.map((team) => (
                <Select.Option value={team} key={team}>
                  {team}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        {selectedTeam !== '' && (
          <Chart
            options={{
              chart: {
                id: 'win-rate-by-team-bar-chart',
                toolbar: {
                  show: false
                }
              },
              plotOptions: {
                bar: {
                  columnWidth: '80%',
                  dataLabels: {
                    position: 'top'
                  }
                }
              },
              xaxis: {
                categories: [selectedTeam],
                labels: {
                  style: {
                    fontSize: '14px'
                  }
                }
              },
              yaxis: {
                forceNiceScale: true,
                decimalsInFloat: 0
              },
              stroke: {
                width: 1,
                colors: ['#fff']
              },
              colors: ['#008000', '#ff0000', '#1677ff', '#faad14'],
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: '16px',
                  colors: ['#fff']
                }
              }
            }}
            series={[
              {
                name: 'Thắng',
                data: [winRate.totalWin]
              },
              {
                name: 'Thua',
                data: [winRate.totalLost]
              },
              {
                name: 'Hoà',
                data: [winRate.totalDraw]
              },
              {
                name: 'Chưa Hoàn Tất',
                data: [winRate.totalUnfinished]
              }
            ]}
            type='bar'
            width='320'
          />
        )}
      </Row>
    </>
  )
}
