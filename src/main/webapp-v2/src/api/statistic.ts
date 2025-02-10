import { API_URL } from '@/constants/common'
import type { BetHistoryFilterRequest, PlayerBetStatistics } from '@/types'
import { apiGet } from './apiClient'

export const fetchPlayerStatisticsWithFilter = async (params: BetHistoryFilterRequest): Promise<PlayerBetStatistics> => {
  const response = await apiGet<PlayerBetStatistics>(`${API_URL.STATISTICS}/detail`, { params })
  return response
}
