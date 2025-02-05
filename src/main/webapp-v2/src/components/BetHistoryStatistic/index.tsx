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
  const totalWin = filterBetResult(data, [BET_RESULT.WIN, BET_RESULT.HALF_WIN]).length
  const totalDraw = filterBetResult(data, [BET_RESULT.DRAW]).length
  const totalLost = filterBetResult(data, [BET_RESULT.LOST, BET_RESULT.HALF_LOST]).length
  const totalUnfinished = filterBetResult(data, [BET_RESULT.UNFINISHED]).length
  const totalBets = data.length

  const totalBetAmount = data.map((bet) => bet.betAmount).reduce((prev, next) => prev + next, 0)

  return (
    <div className={styles['bet-history-statistic-wrapper']}>
      <StatisticDetailRow left='Tổng Số Kèo:' right={totalBets.toLocaleString()} />
      <StatisticDetailRow left='Thắng:' right={`${totalWin} (${((totalWin * 100) / totalBets).toFixed(1)}%)`} />
      <StatisticDetailRow left='Hoà:' right={`${totalDraw} (${((totalDraw * 100) / totalBets).toFixed(1)}%)`} />
      <StatisticDetailRow left='Thua:' right={`${totalLost} (${((totalLost * 100) / totalBets).toFixed(1)}%)`} />
      <StatisticDetailRow
        left='Chưa Có KQ:'
        right={`${totalUnfinished} (${((totalUnfinished * 100) / totalBets).toFixed(1)}%)`}
      />
      <Divider />
      <StatisticDetailRow left='Tổng Tiền Cược:' right={`${totalBetAmount.toLocaleString()}đ`} />
      <StatisticDetailRow left='Lời/Lỗ:' right={calculateProfit(data)} />
    </div>
  )
}
