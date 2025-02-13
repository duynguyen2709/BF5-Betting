import type { BetHistory } from './bet'
import type { PaymentAction, PaymentMethod } from '@/constants'
import type { Dayjs } from 'dayjs'

export interface AssetByDate {
  id: number
  playerId: string
  betId?: number
  paymentTime: string
  assetBefore: number
  assetAfter: number
  amount: number
  action: PaymentAction
  paymentMethod?: PaymentMethod
  updatedAt: string
}

export interface PlayerBetStatistics {
  playerId: string
  startDate: string
  endDate: string
  assetByDateList: AssetByDate[]
  betHistoryList: BetHistory[]
}

export interface StatisticRequest {
  dateRange: [Dayjs, Dayjs]
  action?: PaymentAction
}
