import { Avatar, Statistic } from 'antd'
import React from 'react'

import styles from './index.module.css'

interface PlayerRecentBetsCollapsibleCardProps {
  data: {
    avatarUrl: string
    playerName: string
    totalProfit: number
  }
}

export const PlayerRecentBetsCollapsibleCard: React.FC<PlayerRecentBetsCollapsibleCardProps> = ({ data: player }) => {
  let valueStyle: React.CSSProperties | undefined = undefined
  if (player.totalProfit > 0) {
    valueStyle = { color: 'green' }
  } else if (player.totalProfit < 0) {
    valueStyle = { color: 'red' }
  }

  return (
    <div className={styles['header-row']}>
      <div className={styles['header-avatar']}>
        <Avatar src={player.avatarUrl} size={48} />
      </div>
      <div className={styles['header-detail']}>
        <div className={styles['header-player-name']}>{player.playerName}</div>
        <Statistic
          value={player.totalProfit}
          valueStyle={valueStyle}
          prefix={player.totalProfit > 0 && '+'}
          suffix='đ'
        />
      </div>
    </div>
  )
}
