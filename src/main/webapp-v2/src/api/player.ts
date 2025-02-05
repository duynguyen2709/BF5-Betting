import { apiGet } from './apiClient'

import type { Player } from '@/types'

import { API_URL } from '@/constants'

export async function fetchPlayers(): Promise<Record<string, Player>> {
  const response = await apiGet<Record<string, Player>>(API_URL.PLAYERS)
  return response
}
