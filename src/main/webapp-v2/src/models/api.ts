import { TeamData } from './bet'

export interface BaseResponse<T = any> {
  status: string
  code: number
  data: T
  message?: string
}

export interface DateRangeFilter {
  startDate?: string
  endDate?: string
}

export interface RawBetEvent {
  id: number
  date: number
  tournament: string
  firstTeam: TeamData
  secondTeam: TeamData
  event: string
  score?: string
  status: number
}

export interface RawBetEntity {
  id: number
  date: number
  coef: number
  status: number
  typeTitle: string
  formattedSystemType: string
  sum: number
  winSum?: number
  outSum?: number
  possibleWinSum?: number
  events: RawBetEvent[]
  gameId: number
}

export interface GetRawBetResponse {
  success: boolean
  data: {
    bets: RawBetEntity[]
  }
}
