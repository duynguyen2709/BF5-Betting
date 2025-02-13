import { useQuery } from '@tanstack/react-query'

import type { BetHistory } from '@/types'

import { fetchRecentBetHistory } from '@/api/betHistory'
import { QUERY_KEYS } from '@/constants/common'

interface UseRecentBetsQueryResult {
  playerRecentBets: Record<string, BetHistory[]>
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export const useRecentBetsQuery = (): UseRecentBetsQueryResult => {
  const {
    data: playerRecentBets = {},
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [QUERY_KEYS.BET_HISTORIES, 'recent'],
    queryFn: fetchRecentBetHistory
  })

  return {
    playerRecentBets,
    isLoading,
    error,
    refetch
  }
}
