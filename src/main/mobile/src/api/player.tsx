import { sendGet } from '@/api/fetchClient'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/common/Constant'
import { PlayerRecords } from '@/types/model'

const QUERY_KEY = 'players'

export const useGetPlayers = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const response = await sendGet<PlayerRecords>(API_URL.Players)
      return response.data
    },
  })
}
