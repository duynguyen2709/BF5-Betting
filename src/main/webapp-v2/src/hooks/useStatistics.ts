import { useQuery } from '@tanstack/react-query'
import { fetchDetailStatistics, StatisticsParams } from '@/api/statistics'

export function useDetailStatistics(params: StatisticsParams) {
  const { startDate, endDate } = params

  return useQuery({
    queryKey: ['statistics', { startDate, endDate }],
    queryFn: () => fetchDetailStatistics(params),
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!startDate && !!endDate
  })
}
