import { useMutation } from '@tanstack/react-query'

import type { UnlockRequest } from '@/api'

import { unlock } from '@/api'

export const useUnlock = () =>
  useMutation({
    mutationFn: (request: UnlockRequest) => unlock(request)
  })
