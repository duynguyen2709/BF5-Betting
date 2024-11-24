import { message } from 'antd'
import { MESSAGE, UNLOCK_DATA_KEY } from '@/common/Constant'
import { BaseApiResponse } from '@/types/api'
import ionicStorage from '@/store/ionicStorage'

const baseUrl = import.meta.env.VITE_API_URL

const fetchClient = async <T>(url: string, options: RequestInit = {}): Promise<BaseApiResponse<T>> => {
  const userId = await ionicStorage.get(UNLOCK_DATA_KEY)
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(userId ? { 'X-User-Id': userId } : {}),
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  }

  const response = await fetch(`${baseUrl}${url}`, fetchOptions)

  if (!response.ok) {
    const errorData = await response.json()
    if (response.status === 403) {
      message.error(MESSAGE.TokenExpiredMessage, 4)
    } else if (response.status === 400) {
      message.error(errorData.message, 4)
    } else {
      message.error(MESSAGE.DefaultErrorMessage, 4)
    }
    throw new Error(errorData.message || MESSAGE.DefaultErrorMessage)
  }
  return (await response.json()) as BaseApiResponse<T>
}

export const sendPost = <T>(url: string, payload: any, options: RequestInit = {}) => {
  return fetchClient<T>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    ...options,
  })
}

export const sendGet = <T>(url: string, options: RequestInit = {}) => {
  return fetchClient<T>(url, {
    method: 'GET',
    ...options,
  })
}

export default fetchClient
