import { BetHistory, Player } from '@/models'

export interface BetStore {
  recentBets: BetHistory[]
  selectedBet: BetHistory | null
  setRecentBets: (bets: BetHistory[]) => void
  setSelectedBet: (bet: BetHistory | null) => void
  clearBets: () => void
}

export interface PlayerStore {
  players: Player[]
  selectedPlayer: Player | null
  setPlayers: (players: Player[]) => void
  setSelectedPlayer: (player: Player | null) => void
  clearPlayers: () => void
}
