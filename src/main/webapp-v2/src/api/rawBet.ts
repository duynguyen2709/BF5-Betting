import { apiGet, apiPut } from './apiClient'

import type { BetHistory } from '@/types/bet'
import type { RawBetFilterRequest } from '@/types/rawBet'

import { API_URL } from '@/constants/common'

export const fetchRawBetsWithFilter = async (params: RawBetFilterRequest): Promise<BetHistory[]> => {
  const response = await apiGet<BetHistory[]>(API_URL.RAW_BET, { params })
  return response
}

export const fetchRawBetsQuick = async (sessionToken?: string): Promise<BetHistory[]> => {
  const response = await apiGet<BetHistory[]>(`${API_URL.RAW_BET}/quick`, {
    params: { sessionToken }
  })
  return response
}

export const updateBetResultFromRaw = async (data: BetHistory): Promise<BetHistory> => {
  const response = await apiPut<BetHistory>(`${API_URL.RAW_BET}/${data.betId}/result`, data)
  return response
}

export const updateBatchResultsFromRaw = async (data: BetHistory[]): Promise<BetHistory[]> => {
  const response = await apiPut<BetHistory[]>(`${API_URL.RAW_BET}/result/batch`, data)
  return response
}
