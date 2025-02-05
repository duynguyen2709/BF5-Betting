import { apiPost } from './apiClient'

import { API_URL } from '@/constants'

export interface UnlockRequest {
  key: string
}

export async function unlock(request: UnlockRequest): Promise<string> {
  const response = await apiPost<any>(API_URL.UNLOCK, request)
  if (response.code && response.code !== 200) {
    throw new Error(response.message)
  }
  return response
}
