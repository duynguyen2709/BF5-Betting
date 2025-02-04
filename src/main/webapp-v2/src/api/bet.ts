import { BetHistory, BaseResponse } from '@/models'
import { API_URL } from '@/constants'
import { apiGet } from './apiClient'

export async function fetchRecentBets(): Promise<BetHistory[]> {
  const response = await apiGet<BaseResponse<BetHistory[]>>(`${API_URL.BetHistory}/recent`)
  return response.data
}

export async function fetchBetHistory(params: {
  playerId?: string
  startDate?: string
  endDate?: string
}): Promise<BetHistory[]> {
  const response = await apiGet<BaseResponse<BetHistory[]>>(API_URL.BetHistory, {
    params
  })
  return response.data
}
