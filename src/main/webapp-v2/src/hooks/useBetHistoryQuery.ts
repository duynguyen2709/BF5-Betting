import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { BetHistory, BetHistoryFilterRequest } from '@/types'

import {
  fetchAllBetHistory,
  fetchBetHistoryWithFilter,
  fetchRecentBetHistory,
  insertBetHistory,
  insertBetHistoryBatch,
  updateBetResult
} from '@/api/betHistory'
import { QUERY_KEYS } from '@/constants/common'

export const useAllBetHistoryQuery = () =>
  useQuery({
    queryKey: [QUERY_KEYS.BET_HISTORIES, 'all'],
    queryFn: fetchAllBetHistory
  })

export const useRecentBetHistoryQuery = () =>
  useQuery({
    queryKey: [QUERY_KEYS.BET_HISTORIES, 'recent'],
    queryFn: fetchRecentBetHistory
  })

export const useBetHistoryWithFilterQuery = (params: BetHistoryFilterRequest, enabled: boolean = true) =>
  useQuery({
    queryKey: [QUERY_KEYS.BET_HISTORIES, params],
    queryFn: () => fetchBetHistoryWithFilter(params),
    enabled: enabled && !!params.playerId
  })

export const useInsertBetHistoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bet: Partial<BetHistory>) => insertBetHistory(bet),
    onSuccess: () => {
      console.log('inside onSuccess')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORIES] })
    }
  })
}

export const useInsertBatchBetHistoryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (betList: Partial<BetHistory>[]) => insertBetHistoryBatch(betList),
    onSuccess: () => {
      console.log('inside onSuccess')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORIES] })
    }
  })
}

export const useUpdateBetResultMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BetHistory) => updateBetResult(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORIES] })
    }
  })
}
