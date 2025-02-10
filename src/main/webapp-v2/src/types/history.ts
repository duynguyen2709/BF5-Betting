import type { Dayjs } from 'dayjs'

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
