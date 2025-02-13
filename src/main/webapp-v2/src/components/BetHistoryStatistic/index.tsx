import { Col, Divider, Row, Tag } from 'antd'
import React from 'react'

import styles from './index.module.css'

import type { BetHistory } from '@/types'

import { BET_RESULT } from '@/constants/common'
import { filterBetResult } from '@/utils/betHistory'

interface StatisticDetailTextProps {
  text: string | number | React.ReactNode
  isRightColumn?: boolean
}

const StatisticDetailText: React.FC<StatisticDetailTextProps> = ({ text, isRightColumn = false }) => (
  <p
    className={styles['statistic-detail-text']}
    style={isRightColumn ? { float: 'right', fontWeight: 600 } : undefined}
  >
    {text}
  </p>
)

interface StatisticDetailRowProps {
  left: string | number | React.ReactNode
  right: string | number | React.ReactNode
}

const StatisticDetailRow: React.FC<StatisticDetailRowProps> = ({ left, right }) => (
  <Row>
    <Col span={12}>
      <StatisticDetailText text={left} />
    </Col>
    <Col span={12}>
      <StatisticDetailText text={right} isRightColumn />
    </Col>
  </Row>
)

const formatPercentage = (value: number, total: number): string => {
  const percentage = (value * 100) / total
  return `${value} (${parseFloat(percentage.toFixed(1))}%)`
}

function calculateProfit(data: BetHistory[]): React.ReactNode {
  const sum = data.map((bet) => bet.actualProfit ?? 0).reduce((prev, next) => prev + next, 0)

  if (sum > 0) {
    return <Tag color='success'>{`Lời ${sum.toLocaleString()}đ`}</Tag>
  } else if (sum < 0) {
    return <Tag color='error'>{`Lỗ ${(sum * -1).toLocaleString()}đ`}</Tag>
  } else {
    return <Tag>Hoà</Tag>
  }
}

interface BetHistoryStatisticProps {
  data: BetHistory[]
}

export const BetHistoryStatistic: React.FC<BetHistoryStatisticProps> = ({ data }) => {
  const totalWin = filterBetResult(data, [BET_RESULT.Win, BET_RESULT.HalfWin]).length
  const totalDraw = filterBetResult(data, [BET_RESULT.Draw]).length
  const totalLost = filterBetResult(data, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length
  const totalUnfinished = filterBetResult(data, [BET_RESULT.Unfinished]).length
  const totalBets = data.length

  const totalBetAmount = data.map((bet) => bet.betAmount).reduce((prev, next) => prev + next, 0)

  return (
    <div className={styles['bet-history-statistic-wrapper']}>
      <StatisticDetailRow left='Tổng Số Cược:' right={totalBets.toLocaleString()} />
      <StatisticDetailRow
        left='Thắng:'
        right={<span style={{ color: '#00b96b' }}>{formatPercentage(totalWin, totalBets)}</span>}
      />
      <StatisticDetailRow
        left='Hoà:'
        right={<span style={{ color: '#8c8c8c' }}>{formatPercentage(totalDraw, totalBets)}</span>}
      />
      <StatisticDetailRow
        left='Thua:'
        right={<span style={{ color: '#ff4d4f' }}>{formatPercentage(totalLost, totalBets)}</span>}
      />
      <StatisticDetailRow left='Chưa Có KQ:' right={`${totalUnfinished}`} />
      <Divider />
      <StatisticDetailRow left='Tổng Tiền Cược:' right={`${totalBetAmount.toLocaleString()}đ`} />
      <StatisticDetailRow left='Lời/Lỗ:' right={calculateProfit(data)} />
    </div>
  )
}
