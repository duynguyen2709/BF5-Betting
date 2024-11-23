import { message } from 'antd'
import { MESSAGE } from '@/common/Constant'

const baseUrl = import.meta.env.VITE_API_URL

const fetchClient = async (url: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  const fetchOptions: RequestInit = {
    ...options,
    headers
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

  const data = await response.json()
  if (data && data.data) {
    return data.data
  }
  return data
}

export const sendPostRequest = (url: string, payload: any, options: RequestInit = {}) => {
  return fetchClient(url, {
    method: 'POST',
    body: payload,
    ...options
  })
}

export default fetchClient
