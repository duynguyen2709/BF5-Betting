import dayjs from 'dayjs'

import type { BetHistoryFilterRequest } from '@/types'
import type { HistoryFilterFormValues } from '@/types/history'

import { BetHistoryFilter } from '@/components/BetHistoryFilter'
import { CenterLoadingSpinner } from '@/components/CenterLoadingSpinner'
import { HistoryCardWrapper } from '@/components/HistoryCardWrapper'
import { PlayerRecentBets } from '@/components/PlayerRecentBets'
import { PlayerStatisticCard } from '@/components/PlayerStatisticCard'
import { QueryHistoryAction } from '@/constants'
import { useBetHistoryWithFilterQuery } from '@/hooks'
import { useHistoryPageUrl } from '@/hooks/useHistoryPageUrl'
import { usePlayerStatisticsQuery } from '@/hooks/usePlayerStatistics'

export default function HistoryPage() {
  const [{ queryParams, queryMode }, setUrlState] = useHistoryPageUrl()

  const { data: betHistories, isLoading: betHistoriesLoading } = useBetHistoryWithFilterQuery(
    queryParams,
    queryMode === QueryHistoryAction.VIEW
  )

  const { data: playerStatistics, isLoading: playerStatisticsLoading } = usePlayerStatisticsQuery(
    queryParams,
    queryMode === QueryHistoryAction.STATISTIC
  )

  const handleSubmitFilter = (fieldsValue: HistoryFilterFormValues, mode: QueryHistoryAction) => {
    const { playerId, startDate, endDate } = fieldsValue
    const newQueryParams: BetHistoryFilterRequest = {
      playerId,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    }

    setUrlState({
      queryParams: newQueryParams,
      queryMode: mode
    })
  }

  const isDefaultView = queryMode === undefined
  return (
    <>
      <BetHistoryFilter
        onSubmitFilter={handleSubmitFilter}
        initialValues={
          queryParams.startDate && queryParams.endDate
            ? {
                ...queryParams,
                startDate: dayjs(queryParams.startDate),
                endDate: dayjs(queryParams.endDate)
              }
            : undefined
        }
      />
      {isDefaultView && <PlayerRecentBets />}
      {(betHistoriesLoading || playerStatisticsLoading) && <CenterLoadingSpinner />}
      {queryMode === QueryHistoryAction.VIEW && !betHistoriesLoading && (
        <HistoryCardWrapper data={betHistories || []} historyFilterParams={queryParams} />
      )}
      {queryMode === QueryHistoryAction.STATISTIC && !playerStatisticsLoading && playerStatistics && (
        <PlayerStatisticCard data={playerStatistics} historyFilterParams={queryParams} />
      )}
    </>
  )
}
