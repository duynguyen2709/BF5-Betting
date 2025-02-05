import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type { BetHistory, BetHistoryFilterRequest } from '@/types'

import {
  fetchAllBetHistory,
  fetchRecentBetHistory,
  fetchBetHistoryWithFilter,
  insertBetHistory,
  insertBetHistoryBatch
  // updateBetResult
} from '@/api/betHistory'
import { QUERY_KEYS } from '@/constants/common'
import { BetHistoryUpdateRequest } from '@/types'

export const useAllBetHistoryQuery = () =>
  useQuery({
    queryKey: [QUERY_KEYS.BET_HISTORY, 'all'],
    queryFn: fetchAllBetHistory
  })

export const useRecentBetHistoryQuery = () =>
  useQuery({
    queryKey: [QUERY_KEYS.BET_HISTORY, 'recent'],
    queryFn: fetchRecentBetHistory
  })

export const useBetHistoryQuery = (params: BetHistoryFilterRequest) =>
  useQuery({
    queryKey: [QUERY_KEYS.BET_HISTORY, params],
    queryFn: () => fetchBetHistoryWithFilter(params)
  })

export const useInsertBetHistoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bet: Partial<BetHistory>) => insertBetHistory(bet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORY] })
    }
  })
}

export const useInsertBatchBetHistoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (betList: Partial<BetHistory>[]) => insertBetHistoryBatch(betList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORY] })
    }
  })
}

// TODO: uncomment when API is ready
// export const useUpdateBetResultMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: BetHistoryUpdateRequest) => updateBetResult(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORY] })
//     }
//   })
// }
