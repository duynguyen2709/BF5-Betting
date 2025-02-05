import type { BetHistory, BetMatchDetail } from '@/types'

import { BetGroupTypeKey, BetResult, BetType } from '@/constants/enums'

type BetHistoriesPossibleTypes = BetHistory | BetHistory[] | null | undefined

export function parseBetEvent(matchDetail: BetMatchDetail): string {
  const { event, firstHalfOnly, firstTeam, secondTeam } = matchDetail
  if (!event) {
    console.error('Invalid event of betHistory', event, matchDetail)
    return ''
  }

  const parsedEvent = event
    .replace('Handicap 1', firstTeam)
    .replace('Team 1', firstTeam)
    .replace('Handicap 2', secondTeam)
    .replace('Team 2', secondTeam)
    .replace('W1', `${firstTeam} (-0.5)`)
    .replace('W2', `${secondTeam} (-0.5)`)
    .replace('1X', `${firstTeam} (+0.5)`)
    .replace('2X', `${secondTeam} (+0.5)`)
    .replace('To Win', 'Thắng')
    .replace('Not To Lose', '(+0.5)')
    .replace('Total Over', 'Tài')
    .replace('Total >', 'Tài')
    .replace('Total Under', 'Xỉu')
    .replace('Total <', 'Xỉu')
    .replace(' - Yes', '')
    .replace(' And ', ' & ')
    .replace('Both Teams To Score', 'Cả 2 Đội Cùng Ghi Bàn')
    .replace('Corners:', 'Phạt Góc:')
    .replace('Correct Score', 'Tỉ Số Đúng')
    .replace(/\((\d+(\.\d+)?)\)/, '(+$1)')

  const firstHalfText = firstHalfOnly ? 'Hiệp 1: ' : ''
  return `${firstHalfText}${parsedEvent}`
}

export function filterBetResult(betHistoryList: BetHistory[], resultToFilter: { result: string }[]): BetHistory[] {
  const results = resultToFilter.map((ele) => ele.result)
  return betHistoryList.filter((ele) => results.includes(ele.result.toString()))
}

export function isSingleBet(bet: BetHistoriesPossibleTypes): boolean {
  return bet.betType === BetType.SINGLE
}

export function isAccumulatorBet(bet: BetHistory): boolean {
  return bet.betType !== BetType.SINGLE
}

export function isAllUnfinishedBets(betHistory: BetHistory[]): boolean {
  return !betHistory.some((bet) => bet.result !== BetResult.NOT_FINISHED)
}

export function groupBetHistoriesByTeam(betHistories: BetHistoriesPossibleTypes): Record<string, BetHistory[]> | null {
  if (!betHistories || !(betHistories instanceof Array)) {
    return null
  }
  return betHistories.reduce(
    (acc, bet) => {
      const event = bet.events[0]!
      const teamName = event.firstTeam

      if (!acc[teamName]) {
        acc[teamName] = []
      }
      acc[teamName].push(bet)
      return acc
    },
    {} as Record<string, BetHistory[]>
  )
}

export function groupBetHistoriesByTournament(
  betHistories: BetHistoriesPossibleTypes
): Record<string, BetHistory[]> | null {
  if (!betHistories || !(betHistories instanceof Array)) {
    return null
  }
  return betHistories.reduce(
    (acc, bet) => {
      const event = bet.events[0]!
      const tournamentName = event.tournamentName

      if (!acc[tournamentName]) {
        acc[tournamentName] = []
      }
      acc[tournamentName].push(bet)
      return acc
    },
    {} as Record<string, BetHistory[]>
  )
}

export function groupBetHistoriesByDate(betHistories: BetHistoriesPossibleTypes): Record<string, BetHistory[]> | null {
  if (!betHistories || !(betHistories instanceof Array)) {
    return null
  }
  return betHistories.reduce(
    (acc, bet) => {
      const date = bet.betTime.substring(0, 5)
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(bet)
      return acc
    },
    {} as Record<string, BetHistory[]>
  )
}

type MatchKey = `${string}_${string}_${string}_${string}_${string}`
interface GroupedBetHistory {
  type: BetGroupTypeKey
  data: BetHistory | BetHistory[]
}
export function groupBetHistoriesByType(betHistories: BetHistoriesPossibleTypes): GroupedBetHistory[] | null {
  if (!betHistories || !(betHistories instanceof Array) || betHistories.length === 0) {
    return null
  }

  const betGroupMap: Record<BetGroupTypeKey, (BetHistory | BetHistory[])[]> = {
    [BetGroupTypeKey.Single]: [],
    [BetGroupTypeKey.MultiBetsSameMatch]: [],
    [BetGroupTypeKey.Accumulator]: []
  }

  const tempMap = new Map<MatchKey, BetHistory[]>()

  for (const bet of betHistories) {
    if (isAccumulatorBet(bet)) {
      betGroupMap[BetGroupTypeKey.Accumulator].push(bet)
      continue
    }

    const { matchTime, firstTeam, secondTeam, tournamentName } = bet.events[0]!
    const matchKey = `${bet.playerId}_${matchTime}_${firstTeam}_${secondTeam}_${tournamentName}`
    const existingBets = tempMap.get(matchKey) ?? []
    tempMap.set(matchKey, [...existingBets, bet])
  }

  tempMap.forEach((bets) => {
    if (bets.length > 1) {
      betGroupMap[BetGroupTypeKey.MultiBetsSameMatch].push(bets)
    } else {
      betGroupMap[BetGroupTypeKey.Single].push(bets[0]!)
    }
  })

  return Object.entries(betGroupMap).flatMap(([type, betArray]) =>
    betArray.map((data) => ({
      type: type as BetGroupTypeKey,
      data
    }))
  )
}

export function getDistinctTeamName(betHistoryList: BetHistory[]): string[] {
  const teamNames = new Set<string>()

  betHistoryList.forEach((bet) => {
    const event = bet.events[0]!
    teamNames.add(event.firstTeam)
    teamNames.add(event.secondTeam)
  })

  return Array.from(teamNames)
}
