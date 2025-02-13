import { apiGet, apiPost, apiPut } from './apiClient'

import type { BetHistory, BetHistoryFilterRequest } from '@/types'

import { API_URL } from '@/constants/common'

export const fetchAllBetHistory = async (): Promise<BetHistory[]> => {
  const response = await apiGet<BetHistory[]>(API_URL.BET_HISTORY)
  return response
}

export const fetchRecentBetHistory = async (): Promise<BetHistory[]> => {
  const response = await apiGet<BetHistory[]>(`${API_URL.BET_HISTORY}/recent`)
  return response
}

export const fetchBetHistoryWithFilter = async (params: BetHistoryFilterRequest): Promise<BetHistory[]> => {
  const response = await apiGet<BetHistory[]>(API_URL.BET_HISTORY, { params })
  return response
}

export const insertBetHistory = async (bet: Partial<BetHistory>): Promise<BetHistory> => {
  const response = await apiPost<BetHistory>(API_URL.BET_HISTORY, bet)
  return response
}

export const insertBetHistoryBatch = async (betList: Partial<BetHistory>[]): Promise<BetHistory[]> => {
  const response = await apiPost<BetHistory[]>(`${API_URL.BET_HISTORY}/batch`, betList)
  return response
}

export const updateBetResult = async (data: BetHistory): Promise<BetHistory> => {
  const response = await apiPut<BetHistory>(`${API_URL.BET_HISTORY}/${data.betId}/result`, data)
  return response
}
