import { useQuery } from '@tanstack/react-query'

import { fetchPlayers } from '@/api/player'
import { QUERY_KEYS } from '@/constants'

export const usePlayerQuery = () => {
  const {
    data: players = {},
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [QUERY_KEYS.PLAYERS],
    queryFn: fetchPlayers
  })

  return {
    players,
    isLoading,
    error,
    refetch
  }
}

// Helper function to get a specific player by ID
export const usePlayer = (playerId: string) => {
  const { players, isLoading, error } = usePlayerQuery()

  return {
    player: players[playerId],
    isLoading,
    error
  }
}
