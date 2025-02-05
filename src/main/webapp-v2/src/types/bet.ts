import type { BetResult, BetType, PaymentAction } from '@/constants'

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
  rawStatus?: string
}

export interface BetStatistics {
  totalBets: number
  totalStake: number
  totalProfit: number
  winRate: number
  assetByDateList: {
    date: string
    asset: number
  }[]
  date: string
  asset: number
}

export interface BetHistoryFilterRequest {
  playerId: string
  startDate?: string
  endDate?: string
}

export interface BetHistoryUpdateRequest {
  betId: number
  score: string
  result: BetResult
  actualProfit?: number
}

export interface BetHistoryStatistic {
  playerId: string
  startDate: string
  endDate: string
  assetByDateList: AssetByDate[]
  betHistoryList: BetHistory[]
}

export interface AssetByDate {
  paymentTime: string
  assetBefore: number
  assetAfter: number
  action: PaymentAction
}
