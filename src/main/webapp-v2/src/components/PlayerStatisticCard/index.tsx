import { Card, Divider, Empty } from 'antd'
import React from 'react'

import { HistoryCardMetadata } from '../HistoryCardMetadata'
import {
  ChartAssetByDate,
  ChartTopWinRateByTeam,
  ChartTopWinRateByTournament,
  ChartWinRateByDate,
  ChartWinRateByTeam
} from '../PlayerBetStatisticChart'
import { BetStatisticGroup } from './BetStatisticGroup'
import styles from './index.module.css'

import { MESSAGES } from '@/constants'
import { usePlayerQuery } from '@/hooks'
import { isAllUnfinishedBets } from '@/utils/betHistory'

export const PlayerStatisticCard: React.FC<{
  data: {
    assetByDateList: any[]
    betHistoryList: any[]
  }
  historyFilterParams: any
}> = ({ data, historyFilterParams }) => {
  const { assetByDateList, betHistoryList } = data
  const { players } = usePlayerQuery()

  const isBetHistoryEmpty = betHistoryList && betHistoryList.length === 0
  const allUnfinishedBets = isAllUnfinishedBets(betHistoryList)

  function CardStatisticContent() {
    if (isBetHistoryEmpty) {
      return <Empty className={styles['card-bet-empty']} description={MESSAGES.EMPTY_BET} />
    } else if (allUnfinishedBets) {
      return <Empty className={styles['card-bet-empty']} description={MESSAGES.ALL_BET_UNFINISHED} />
    } else {
      return (
        <>
          <Divider style={{ margin: '1rem 0' }} />
          <BetStatisticGroup title='Thống Kê Cược' data={betHistoryList} />
          <ChartAssetByDate title='Thống Kê Tài Sản Theo Ngày' data={assetByDateList} />
          <ChartWinRateByDate title='Thống Kê Tỉ Lệ Thắng Theo Ngày' data={betHistoryList} />
          <ChartTopWinRateByTournament title='Thống Kê Kết Quả Theo Giải (Top 5)' data={betHistoryList} />
          <ChartTopWinRateByTeam title='Thống Kê Kết Quả Theo Đội (Top 5)' data={betHistoryList} />
          <ChartWinRateByTeam title='Xem Thống Kê Theo Đội' data={betHistoryList} />
        </>
      )
    }
  }

  return (
    <Card className={styles['card-player-statistic']}>
      <HistoryCardMetadata players={players} data={historyFilterParams} style={{ padding: '1rem 1rem 0' }} />
      <CardStatisticContent />
    </Card>
  )
}

export default PlayerStatisticCard
