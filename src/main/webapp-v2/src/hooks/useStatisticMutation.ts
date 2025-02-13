import { useMutation } from '@tanstack/react-query'

import { runStatistic } from '@/api'

export function useStatisticMutation() {
  return useMutation({
    mutationFn: runStatistic
  })
}
