import { fetchRawBetsQuick, fetchRawBetsWithFilter, updateBatchResultsFromRaw, updateBetResultFromRaw } from '@/api/rawBet';
import { QUERY_KEYS } from '@/constants';
import { BetHistory } from '@/types/bet';
import { RawBetFilterRequest } from '@/types/rawBet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const QUERY_RAW_BETS_KEY = [QUERY_KEYS.BET_HISTORIES, 'RAW'];

export function useRawBetQuery(params: RawBetFilterRequest) {
  return useQuery<BetHistory[]>({
    queryKey: [...QUERY_RAW_BETS_KEY, params],
    queryFn: () => fetchRawBetsWithFilter(params),
    enabled: false,
  });
}

export function useQuickRawBetQuery(sessionToken?: string) {
  return useQuery<BetHistory[]>({
    queryKey: [...QUERY_RAW_BETS_KEY, 'QUICK'],
    queryFn: () => fetchRawBetsQuick(sessionToken),
    enabled: false,
  });
}

export function useUpdateRawBetResultMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...QUERY_RAW_BETS_KEY, 'RESULT'],
    mutationFn: (data: BetHistory) => updateBetResultFromRaw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORIES] })
    }
  })
}

export function useBatchUpdateRawBetResultsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...QUERY_RAW_BETS_KEY, 'RESULT-BATCH'],
    mutationFn: (data: BetHistory[]) => updateBatchResultsFromRaw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BET_HISTORIES] })
    }
  })
}