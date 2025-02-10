import { PaymentAction } from "@/constants"
import { BetHistory } from "./bet"

export interface AssetByDate {
    paymentTime: string
    assetBefore: number
    assetAfter: number
    action: PaymentAction
}

export interface PlayerBetStatistics {
    playerId: string
    startDate: string
    endDate: string
    assetByDateList: AssetByDate[]
    betHistoryList: BetHistory[]
  }
  