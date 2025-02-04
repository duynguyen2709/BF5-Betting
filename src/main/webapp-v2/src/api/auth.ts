import { API_URL } from '@/constants'
import { useMutation } from '@tanstack/react-query'
import { apiPost } from './apiClient'

export interface UnlockRequest {
  key: string
}
async function unlock(request: UnlockRequest): Promise<string> {
  const response = await apiPost<any>(API_URL.Unlock, request)
  if (response.code && response.code !== 200) {
    throw new Error(response.message)
  } 
  return response
}

export const useUnlock = () => {
  return useMutation({
    mutationFn: (request: UnlockRequest) => unlock(request),
  })
}
