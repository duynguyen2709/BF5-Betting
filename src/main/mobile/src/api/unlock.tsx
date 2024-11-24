import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/common/Constant'
import { sendPost } from '@/api/fetchClient'
import { BaseApiResponse } from '@/types/api'

export const useUnlockHome = () => {
  return useMutation<BaseApiResponse<string>, Error, string>({
    mutationKey: [API_URL.Unlock],
    mutationFn: (key: string) => sendPost(API_URL.Unlock, { key }),
  })
}
