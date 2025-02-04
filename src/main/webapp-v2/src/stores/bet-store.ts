import { create } from 'zustand'
import type { BetStore } from './types'

const useBetStore = create<BetStore>((set) => ({
  recentBets: [],
  selectedBet: null,

  setRecentBets: (bets) => set({ recentBets: bets }),
  setSelectedBet: (bet) => set({ selectedBet: bet }),
  clearBets: () => set({ recentBets: [], selectedBet: null })
}))

export default useBetStore
