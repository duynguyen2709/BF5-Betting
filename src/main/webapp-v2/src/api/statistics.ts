import { API_URL } from '@/constants'
import { BaseResponse, PlayerStatistics } from '@/models'
import { apiGet } from './apiClient'

export interface StatisticsParams {
  startDate?: string
  endDate?: string
}

export async function fetchDetailStatistics(params: StatisticsParams): Promise<PlayerStatistics[]> {
  const response = await apiGet<BaseResponse<PlayerStatistics[]>>(API_URL.Statistics, {
    params
  })
  return response.data
}
