import { create } from 'zustand'
import { fetchPlayers } from '@/api/player'
import { Player } from '@/models'

interface PlayerState {
  players: Record<string, Player>
  fetch: () => Promise<void>
}

export const usePlayerStore = create<PlayerState>((set) => ({
  players: {},
  fetch: async () => {
    const playersData = await fetchPlayers()
    set({ players: playersData })
  }
}))

export default usePlayerStore