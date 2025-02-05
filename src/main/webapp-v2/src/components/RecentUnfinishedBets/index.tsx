import React from 'react'

import type { BetHistory } from '@/types'

import { groupBetHistoriesByType } from '@/utils/betHistory'
import BetHistoryCard from '../BetHistoryCard'

interface RecentUnfinishedBetsProps {
  data: BetHistory[]
}

export const RecentUnfinishedBets: React.FC<RecentUnfinishedBetsProps> = ({ data }) => {
  console.log('data', data)
  if (!data.length) {
    return null
  }
  const betHistoriesByGroup = groupBetHistoriesByType(data) || []
  console.log('betHistoriesByGroup', betHistoriesByGroup)
  return (
    <>
      {betHistoriesByGroup.map((ele) => (
        <BetHistoryCard key={ele.type} data={ele.data as any} type={ele.type} />
      ))}
    </>
  )
}
