import { runStatistic } from '@/api';
import { useMutation } from '@tanstack/react-query';

export function useStatisticMutation() {
  return useMutation({
    mutationFn: runStatistic,
  });
}
