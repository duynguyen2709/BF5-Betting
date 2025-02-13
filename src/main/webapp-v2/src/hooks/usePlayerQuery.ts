import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

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

export const usePlayer = (playerId: string) => {
  const { players, isLoading, error } = usePlayerQuery()

  return {
    player: players[playerId],
    isLoading,
    error
  }
}

export const usePlayersWithSortedProfit = () => {
  const { players } = usePlayerQuery()
  return useMemo(() => {
    const playerArray = Object.values(players)
    playerArray.sort((a, b) => b.totalProfit - a.totalProfit)
    return playerArray
  }, [players])
}
