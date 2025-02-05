import { message } from 'antd'
import axios, { AxiosHeaders } from 'axios'

import type { BaseResponse } from '@/types'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

import { ADMIN_USER_ID, MESSAGES, STORAGE_KEYS } from '@/constants'

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env['VITE_BACKEND_API_URL'] as string,
  headers: AxiosHeaders.from({
    'Content-Type': 'application/json'
  })
})

axiosClient.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem(STORAGE_KEYS.UNLOCK_DATA) || ADMIN_USER_ID
    config.headers = AxiosHeaders.from({
      ...config.headers.toJSON(),
      'X-User-Id': userId
    })
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    if (response && response.data) {
      return response.data.data || response.data
    }
    return response
  },
  (error: AxiosError) => {
    console.error('AxiosError', error)

    if (error.response?.status === 403) {
      message.error(MESSAGES.TOKEN_EXPIRED, 4)
    } else if (error.response?.status === 400) {
      message.error((error.response.data as BaseResponse).message || MESSAGES.DEFAULT_ERROR, 4)
    } else {
      message.error(MESSAGES.DEFAULT_ERROR, 4)
    }
    return Promise.reject(error.response?.data || error.response || MESSAGES.DEFAULT_ERROR)
  }
)

export const apiGet = async <T>(url: string, params?: object): Promise<T> => axiosClient.get<T, T>(url, { params })

export const apiPost = async <T, D = any>(url: string, data?: D): Promise<T> => axiosClient.post<T, T, D>(url, data)

export const apiPut = async <T, D = any>(url: string, data?: D): Promise<T> => axiosClient.put<T, T, D>(url, data)

export default axiosClient
