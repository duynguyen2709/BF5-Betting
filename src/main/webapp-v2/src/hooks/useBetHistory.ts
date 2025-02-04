import { useQuery } from '@tanstack/react-query'
import { fetchBetHistory, fetchRecentBets } from '@/api'

export function useRecentBets() {
  return useQuery({
    queryKey: ['recentBets'],
    queryFn: fetchRecentBets,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    gcTime: 1000 * 60 * 5 // 5 minutes
  })
}

interface BetHistoryParams {
  playerId?: string
  startDate?: string
  endDate?: string
}

export function useBetHistory(params: BetHistoryParams) {
  const { playerId, startDate, endDate } = params

  return useQuery({
    queryKey: ['betHistory', { playerId, startDate, endDate }],
    queryFn: () => fetchBetHistory(params),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!startDate && !!endDate
  })
}
