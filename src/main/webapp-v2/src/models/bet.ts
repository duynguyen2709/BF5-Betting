import { BetResult, BetType, PaymentAction } from './enums';

export interface TeamData {
  teamId: string;
  teamName: string;
  teamNameVn: string;
  logoUrl: string;
}

export interface BetMatchDetail {
  matchDetailId: string;
  betId: number;
  event: string;
  tournament: string;
  firstTeam: TeamData;
  secondTeam: TeamData;
  startTime: Date;
  score?: string;
  result?: BetResult;
  firstHalfOnly?: boolean;
}

export interface BetHistory {
  betId: number;
  playerId: string;
  betTime: Date;
  type: BetType;
  stake: number;
  ratio: number;
  possibleWinning: number;
  actualProfit: number;
  result: BetResult;
  resultSettledTime?: Date;
  matchDetails: BetMatchDetail[];
}

export interface BetHistoryUpdateRequest {
  betId: number;
  score: string;
  result: BetResult;
  actualProfit?: number;
}

export interface BetHistoryStatistic {
  playerId: string;
  startDate: string;
  endDate: string;
  assetByDateList: AssetByDate[];
  betHistoryList: BetHistory[];
}

export interface AssetByDate {
  paymentTime: string;
  assetBefore: number;
  assetAfter: number;
  action: PaymentAction;
}
