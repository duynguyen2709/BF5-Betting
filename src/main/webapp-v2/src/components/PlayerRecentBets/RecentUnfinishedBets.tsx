import React from 'react'

import BetHistoryCard from '../BetHistoryCard'

import type { BetHistory, GroupedBetHistory } from '@/types'

import { groupBetHistoriesByType } from '@/utils/betHistory'

interface RecentUnfinishedBetsProps {
  data: BetHistory[]
}

export const RecentUnfinishedBets: React.FC<RecentUnfinishedBetsProps> = ({ data }) => {
  if (!data.length) {
    return null
  }
  const betHistoriesByGroup = groupBetHistoriesByType(data) || []
  return (
    <>
      {betHistoriesByGroup.map((ele: GroupedBetHistory) => (
        <BetHistoryCard key={ele.type} data={ele.data} type={ele.type} />
      ))}
    </>
  )
}
