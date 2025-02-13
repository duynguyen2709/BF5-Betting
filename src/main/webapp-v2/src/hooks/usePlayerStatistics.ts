import { useQuery } from '@tanstack/react-query'

import type { BetHistoryFilterRequest, PlayerBetStatistics } from '@/types'

import { fetchPlayerStatisticsWithFilter } from '@/api/statistic'
import { QUERY_KEYS } from '@/constants'

export const usePlayerStatisticsQuery = (queryParams: BetHistoryFilterRequest, enabled = true) =>
  useQuery<PlayerBetStatistics, Error>({
    queryKey: [QUERY_KEYS.PLAYER_STATISTICS, queryParams],
    queryFn: () => fetchPlayerStatisticsWithFilter(queryParams),
    enabled: enabled && !!queryParams.playerId && !!queryParams.startDate && !!queryParams.endDate
  })
