import { fetchAllAssetHistory, insertPaymentHistory } from '@/api';
import type { AssetByDate } from '@/types/statistic';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

export function useAllAssetHistoryQuery() {
  return useQuery<AssetByDate[]>({
    queryKey: [QUERY_KEYS.ASSET_HISTORIES, 'all'],
    queryFn: fetchAllAssetHistory
  });
}

export function useAddPaymentHistoryMutation() {
  return useMutation({
    mutationFn: insertPaymentHistory,
  });
}
