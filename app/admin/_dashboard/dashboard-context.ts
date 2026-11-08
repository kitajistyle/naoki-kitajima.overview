'use client'

import { createContext } from 'react'
import type { Period, SortKey } from '../dashboard-data'
import type { AdminRaw } from '../lib/types'

export interface DashboardState {
  raw: AdminRaw
  period: Period
  sort: SortKey
  appIndex: number
  setPeriod: (p: Period) => void
  setSort: (s: SortKey) => void
  setAppIndex: (i: number) => void
}

export const DashboardContext = createContext<DashboardState | null>(null)
