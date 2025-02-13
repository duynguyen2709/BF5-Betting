import { apiPut } from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants';
import type { RawBetEntity } from '@/types/api';
import { useMutation } from '@tanstack/react-query';

export function useUpdateRawBetMutation() {
  return useMutation<void, Error, RawBetEntity[]>({
    mutationFn: (data) => apiPut(API_ENDPOINTS.BET.RAW, data),
  });
}
