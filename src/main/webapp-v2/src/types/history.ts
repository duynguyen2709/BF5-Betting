import type { Dayjs } from 'dayjs'

export interface HistoryFilterParams {
  playerId: string
  startDate: string | null
  endDate: string | null
}

export interface HistoryFilterFormValues {
  playerId: string
  startDate: Dayjs
  endDate: Dayjs
}

export interface TabKey {
  label: string
  key: string
}

export interface TabKeys {
  History: TabKey
  Statistic: TabKey
}
