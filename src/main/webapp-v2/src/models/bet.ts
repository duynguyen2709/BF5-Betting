import { BetResult, BetType, PaymentAction } from './enums'

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
  firstHalfOnly: boolean
  score: string
  ratio: number
  result: BetResult
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
  actualProfit: number
  matchDetail: BetMatchDetail
}

export interface BetStatistics {
  totalBets: number
  totalStake: number
  totalProfit: number
  winRate: number
  assetByDateList: Array<{
    date: string
    asset: number
  }>
}

export interface BetFilter {
  playerId?: string
  startDate?: string
  endDate?: string
  status?: 'PENDING' | 'COMPLETED'
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
