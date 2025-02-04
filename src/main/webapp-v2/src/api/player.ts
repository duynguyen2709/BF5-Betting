import { BaseResponse, Player } from '@/models'
import { API_URL } from '@/constants'
import { apiGet } from './apiClient'

export async function fetchPlayers(): Promise<Record<string, Player>> {
  const response = await apiGet<BaseResponse<Record<string, Player>>>(API_URL.Players)
  return response.data
}
