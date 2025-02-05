import React from 'react'

import type { BetHistory } from '@/types'

import { groupBetHistoriesByType } from '@/utils/betHistory'
import BetHistoryCard from '../BetHistoryCard'

interface RecentUnfinishedBetsProps {
  data: BetHistory[]
}

export const RecentUnfinishedBets: React.FC<RecentUnfinishedBetsProps> = ({ data }) => {
  if (!data.length) {
    return null
  }

  const betHistoriesByGroup = groupBetHistoriesByType(data) || {}
  return (
    <>
      {Object.entries(betHistoriesByGroup).map(([type, bets]) => (
        <BetHistoryCard key={type} data={bets as any} type={type} />
      ))}
    </>
  )
}
