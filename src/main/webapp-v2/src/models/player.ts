import { PaymentAction } from "./enums";

export interface Player {
  playerId: string;
  playerName: string;
  totalProfit: number;
  isActive: boolean;
  createdTime: Date;
  lastModifiedTime: Date;
}

export interface PlayerAssetHistory {
  id: number;
  playerId: string;
  assetBefore: number;
  assetAfter: number;
  paymentTime: Date;
  action: PaymentAction;
  betId?: number;
}

export interface AddPlayerAssetHistoryRequest {
  playerId: string;
  amount: number;
  action: PaymentAction;
  paymentTime?: string;
}
