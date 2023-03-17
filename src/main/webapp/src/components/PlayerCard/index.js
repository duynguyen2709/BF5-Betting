import React from 'react'
import {Avatar, Card, Statistic} from 'antd'

import './index.scss'

const {Meta} = Card

const PlayerCard = ({data}) => {
  const positiveProfit = data.totalProfit >= 0
  return <Card className={"card-player"}>
    <Meta
        avatar={<Avatar src={data.avatarUrl} size={48} />}
        title={data.playerName}
        description={<Statistic
            value={data.totalProfit}
            valueStyle={positiveProfit ? {  color: 'green' } : {color: 'red' }}
            prefix={positiveProfit && '+'}
            suffix="đ"
        />}
    />
  </Card>
}

export default PlayerCard