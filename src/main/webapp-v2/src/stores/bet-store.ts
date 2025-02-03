import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BetState } from './types';

export const useBetStore = create<BetState>()(
  devtools((set) => ({
    recentBets: [],
    selectedBet: undefined,
    isLoading: false,
    error: undefined,
    setRecentBets: (recentBets) => set({ recentBets }),
    setSelectedBet: (selectedBet) => set({ selectedBet }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: undefined }),
  }))
);
