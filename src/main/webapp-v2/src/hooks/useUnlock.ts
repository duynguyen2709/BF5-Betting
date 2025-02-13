import { useMutation } from '@tanstack/react-query'

import { unlock } from '@/api'

export const useUnlock = () =>
  useMutation({
    mutationFn: unlock
  })
