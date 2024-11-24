import { BaseApiResponse } from '@/types/api'

export function isApiSuccess<T>(response: BaseApiResponse<T>): boolean {
  return response.code === 200
}
