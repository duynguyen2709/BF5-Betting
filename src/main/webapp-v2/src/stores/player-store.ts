import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PlayerState } from './types';

export const usePlayerStore = create<PlayerState>()(
  devtools((set) => ({
    players: [],
    selectedPlayer: undefined,
    playerAssetHistory: [],
    isLoading: false,
    error: undefined,
    setPlayers: (players) => set({ players }),
    setSelectedPlayer: (selectedPlayer) => set({ selectedPlayer }),
    setPlayerAssetHistory: (playerAssetHistory) => set({ playerAssetHistory }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: undefined }),
  }))
);
