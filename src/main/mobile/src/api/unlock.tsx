import { useMutation } from '@tanstack/react-query'
import { API_URL } from '@/common/Constant'
import { sendPostRequest } from '@/api/fetchClient'

export const useUnlockHome = () => {
  return useMutation({
    mutationKey: [API_URL.Unlock],
    mutationFn: (key) => sendPostRequest(API_URL.Unlock, { key })
  })
}
