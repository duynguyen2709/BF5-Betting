import { DownCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons'
import React, { Badge, Collapse } from 'antd'

import styles from './index.module.css'
import { PlayerRecentBetsCollapsibleCard } from './RecentBetsCard'
import { RecentUnfinishedBets } from './RecentUnfinishedBets'
import { CenterLoadingSpinner } from '../CenterLoadingSpinner'

import { usePlayersWithSortedProfit, useRecentBetsQuery } from '@/hooks'

export const PlayerRecentBets: React.FC = () => {
  const { playerRecentBets, isLoading: recentBetLoading } = useRecentBetsQuery()
  const playersWithSortedProfit = usePlayersWithSortedProfit()

  if (recentBetLoading) {
    return <CenterLoadingSpinner />
  }

  const items = playersWithSortedProfit.map((player) => {
    const hasBets = (playerRecentBets[player.playerId] || []).length > 0
    return {
      key: player.playerId,
      label: <PlayerRecentBetsCollapsibleCard data={player} />,
      children: <RecentUnfinishedBets data={playerRecentBets[player.playerId] || []} />,
      collapsible: hasBets ? undefined : 'disabled',
      showArrow: hasBets,
      extra: hasBets ? (
        <div
          style={{
            position: 'absolute',
            right: '8px',
            top: '18px'
          }}
        >
          <Badge count={playerRecentBets[player.playerId]?.length} color='#fe6300' size='small' />
        </div>
      ) : undefined
    }
  })

  return (
    <div className={styles['list-player-asset-wrapper']}>
      <Collapse
        items={items as any[]}
        expandIconPosition='end'
        expandIcon={(panelProps) => {
          const Icon = panelProps.isActive ? DownCircleTwoTone : RightCircleTwoTone
          return <Icon className={styles['collapsible-arrow-icon']} twoToneColor='#52c41a' />
        }}
      />
    </div>
  )
}
