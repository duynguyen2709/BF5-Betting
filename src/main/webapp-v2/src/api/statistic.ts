import { apiGet, apiPost } from './apiClient'

import type { AssetByDate, BetHistoryFilterRequest, PlayerBetStatistics, StatisticRequest } from '@/types'

import { API_URL } from '@/constants/common'

export const fetchPlayerStatisticsWithFilter = async (
  params: BetHistoryFilterRequest
): Promise<PlayerBetStatistics> => {
  const response = await apiGet<PlayerBetStatistics>(`${API_URL.STATISTICS}/detail`, { params })
  return response
}

export const fetchAllAssetHistory = async (): Promise<AssetByDate[]> => {
  const response = await apiGet<AssetByDate[]>(`${API_URL.STATISTICS}`)
  return response
}

export const insertPaymentHistory = async (asset: Partial<AssetByDate>): Promise<AssetByDate> => {
  const response = await apiPost<AssetByDate>(`${API_URL.STATISTICS}/asset`, asset)
  return response
}

export const runStatistic = async (data: StatisticRequest): Promise<void> => {
  const response = await apiPost<void>(`${API_URL.STATISTICS}`, {
    startDate: data.dateRange[0].format('YYYY-MM-DD'),
    endDate: data.dateRange[1].format('YYYY-MM-DD'),
    action: 'statistic'
  })
  return response
}
