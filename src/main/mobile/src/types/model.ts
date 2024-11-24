export interface Player {
  playerId: string
  playerName: string
  avatarUrl: string
  totalProfit: number
  telegramId?: string
}

export type PlayerRecords = Record<string, Player>
