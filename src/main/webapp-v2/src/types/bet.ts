import type { BetResult, BetType } from '@/constants'

export interface TeamData {
  teamId: string
  teamName: string
  teamNameVn: string
  logoUrl: string
}

export interface BetMatchDetail {
  id: number
  betId: number
  matchId: number
  matchTime: string
  firstTeam: string
  secondTeam: string
  tournamentName: string
  event: string
  firstHalfOnly?: boolean
  score?: string
  ratio: number
  result: BetResult
  firstTeamLogoUrl?: string
  secondTeamLogoUrl?: string
}

export interface BetHistory {
  betId: number
  playerId: string
  betType: BetType
  metadata: string
  betTime: string
  betAmount: number
  ratio: number
  potentialProfit: number
  result: BetResult
  actualProfit?: number
  events: BetMatchDetail[]
  rawStatus: string
}

export interface BetHistoryFilterRequest {
  playerId: string
  startDate?: string
  endDate?: string
}
