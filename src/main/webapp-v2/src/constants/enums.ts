export enum QueryHistoryAction {
  VIEW = 'VIEW',
  STATISTIC = 'STATISTIC'
}

export enum RawBetStatus {
  NEW = 'NEW',
  INSERTED = 'INSERTED',
  RESULT_READY = 'RESULT_READY',
  SETTLED = 'SETTLED'
}

export enum BetResult {
  WIN = 'WIN',
  HALF_WIN = 'HALF_WIN',
  LOST = 'LOST',
  HALF_LOST = 'HALF_LOST',
  DRAW = 'DRAW',
  NOT_FINISHED = 'NOT_FINISHED'
}

export enum BetType {
  SINGLE = 'SINGLE',
  ACCUMULATOR = 'ACCUMULATOR',
  LUCKY = 'LUCKY',
  SYSTEM = 'SYSTEM'
}

export enum PaymentAction {
  CASHOUT = 'CASHOUT',
  DEPOSIT = 'DEPOSIT',
  BET_WIN = 'BET_WIN',
  BET_LOST = 'BET_LOST'
}

export enum BetGroupTypeKey {
  Single = 'SINGLE',
  MultiBetsSameMatch = 'MULTI',
  Accumulator = 'ACCUMULATOR'
}
