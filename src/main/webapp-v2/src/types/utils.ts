import type { BetHistory } from './bet'
import type { BetGroupTypeKey } from '@/constants'
import type React from 'react'

// Generic Types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ValueOf<T> = T[keyof T]
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Function Types
export type AsyncFunction<T = void> = () => Promise<T>
export type AsyncFunctionWithParams<P, T = void> = (params: P) => Promise<T>
export type SyncFunction<T = void> = () => T
export type SyncFunctionWithParams<P, T = void> = (params: P) => T

// React Types
export interface ReactChildren {
  children: React.ReactNode
}

export type WithClassName<T = unknown> = T & {
  className?: string
}

// Form Types
export type FormErrors<T> = {
  [P in keyof T]?: string[]
}

export type FormTouched<T> = {
  [P in keyof T]?: boolean
}

// API Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  error?: ApiError
}

// Event Types
export type KeyboardEvent = React.KeyboardEvent<HTMLElement>
export type MouseEvent = React.MouseEvent<HTMLElement>
export type ChangeEvent = React.ChangeEvent<HTMLElement>
export type FormEvent = React.FormEvent<HTMLElement>

// Utility Types
export type RecordOf<T> = Record<string, T>
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer E)[] ? E : never
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// Component Props Types
export type Size = 'small' | 'middle' | 'large'
export type Status = 'success' | 'error' | 'warning' | 'info'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Theme Types
export type Theme = 'light' | 'dark'
export interface ColorScheme {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
}

export type MatchKey = `${string}_${string}_${string}_${string}_${string}`
export interface GroupedBetHistory {
  type: BetGroupTypeKey
  data: BetHistory | BetHistory[]
}
