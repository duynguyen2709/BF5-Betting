import type { Dayjs } from 'dayjs'

export interface QueryRawBetFormValues {
  sessionToken: string
  dateRange: [Dayjs, Dayjs]
}

export interface RawBetFilterRequest {
  sessionToken: string
  startDate: string
  endDate: string
}
