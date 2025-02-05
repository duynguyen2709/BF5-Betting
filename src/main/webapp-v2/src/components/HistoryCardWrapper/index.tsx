import { Card, Empty, Tabs } from 'antd'
import React from 'react'

import styles from './index.module.css'

import type { BetHistory } from '@/types'
import type { HistoryFilterParams } from '@/types/history'

import { BetHistoryStatistic } from '@/components/BetHistoryStatistic'
import { HistoryCardMetadata } from '@/components/HistoryCardMetadata'
import { MESSAGES } from '@/constants/common'
import { usePlayerQuery } from '@/hooks'
import { groupBetHistoriesByType } from '@/utils/betHistory'
import BetHistoryCard from '../BetHistoryCard'

interface TabKey {
  label: string
  key: string
}

const TAB_KEYS: Record<string, TabKey> = {
  History: {
    label: 'Danh Sách Cược',
    key: 'history'
  },
  Statistic: {
    label: 'Tổng Hợp',
    key: 'summary'
  }
}

interface HistoryCardWrapperProps {
  data: BetHistory[]
  historyFilterParams: HistoryFilterParams
  historyActiveTab: string
  onChangeHistoryActiveTab: (key: string) => void
  cardRef: React.RefObject<HTMLDivElement>
}

export const HistoryCardWrapper: React.FC<HistoryCardWrapperProps> = ({
  data,
  historyFilterParams,
  historyActiveTab,
  onChangeHistoryActiveTab,
  cardRef
}) => {
  const { players } = usePlayerQuery()

  const isHistoryListNotEmpty = data && data.length > 0
  const isHistoryFetchedButEmpty = data !== undefined && data.length === 0
  const betHistoriesByGroup = groupBetHistoriesByType(data) || {}

  return (
    <Card ref={cardRef} className={styles['card-bet-wrapper']}>
      <HistoryCardMetadata
        players={players}
        data={historyFilterParams}
        style={{ padding: '0.5rem', paddingTop: '1rem' }}
      />
      {isHistoryFetchedButEmpty && (
        <Empty className={styles['card-bet-empty']} description={MESSAGES.EMPTY_BET} />
      )}
      {isHistoryListNotEmpty && (
        <Tabs
          activeKey={historyActiveTab}
          onChange={onChangeHistoryActiveTab}
          items={[
            {
              key: TAB_KEYS['History']!.key,
              label: TAB_KEYS['History']!.label,
              children: Object.entries(betHistoriesByGroup).map(([type, bets]) => (
                <BetHistoryCard key={type} data={bets as any} type={type} isHistoryViewMode />
              ))
            },
            {
              key: TAB_KEYS['Statistic']!.key,
              label: TAB_KEYS['Statistic']!.label,
              children: <BetHistoryStatistic data={data} />
            }
          ]}
        />
      )}
    </Card>
  )
}
