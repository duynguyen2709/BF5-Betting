import { useQuery } from '@tanstack/react-query'
import type { BetHistory } from '@/models'
import { getBetHistory } from '@/services/bet'

export function useRecentBets() {
  return useQuery<BetHistory[]>({
    queryKey: ['recentBets'],
    queryFn: () => getBetHistory({ unfinishedOnly: true })
  })
}
