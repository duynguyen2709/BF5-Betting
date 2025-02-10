import type { PaymentAction } from '@/constants'

export interface Player {
  playerId: string
  playerName: string
  avatarUrl: string
  totalProfit: number
  telegramId: string
}

export interface PlayerAssetHistory {
  id: number
  playerId: string
  betId?: number
  paymentTime: string
  action: PaymentAction
  paymentMethod: string
  amount: number
  assetBefore: number
  assetAfter: number
  updatedAt: string
}

export interface PlayerFilter {
  name?: string
  minAsset?: number
  maxAsset?: number
  startDate?: string
  endDate?: string
}

export interface AddPlayerAssetHistoryRequest {
  playerId: string
  amount: number
  action: PaymentAction
  paymentTime?: string
}
