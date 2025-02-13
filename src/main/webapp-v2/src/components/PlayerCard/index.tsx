import { Avatar, Card, Statistic } from 'antd'

import styles from './styles.module.css'

import type { Player } from '@/types/player'

const { Meta } = Card

interface PlayerCardProps {
  data: Player
}

export function PlayerCard({ data }: PlayerCardProps) {
  const valueStyle = data.totalProfit > 0 ? { color: 'green' } : data.totalProfit < 0 ? { color: 'red' } : undefined

  return (
    <Card className={styles['cardPlayer']}>
      <Meta
        avatar={<Avatar src={data.avatarUrl} size={48} />}
        title={data.playerName}
        description={
          <Statistic
            value={data.totalProfit}
            valueStyle={valueStyle}
            prefix={data.totalProfit > 0 ? '+' : undefined}
            suffix='đ'
          />
        }
      />
    </Card>
  )
}
