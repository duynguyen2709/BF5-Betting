export interface BaseApiResponse<T> {
  status: string
  message: string
  code: number
  data: T
}
