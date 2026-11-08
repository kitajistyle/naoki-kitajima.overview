'use client'

import { useMemo, useState } from 'react'
import type { Period, SortKey } from '../dashboard-data'
import type { AdminRaw } from '../lib/types'
import { DashboardContext } from './dashboard-context'

// Lives in the (dashboard) layout so period / sort / selected app survive
// navigation between the overview, apps, revenue and users pages.
export function DashboardProvider({ raw, children }: { raw: AdminRaw; children: React.ReactNode }) {
  const [period, setPeriod] = useState<Period>(30)
  const [sort, setSort] = useState<SortKey>('total')
  const [appIndex, setAppIndex] = useState(0)

  const value = useMemo(
    () => ({ raw, period, sort, appIndex, setPeriod, setSort, setAppIndex }),
    [raw, period, sort, appIndex]
  )

  return <DashboardContext value={value}>{children}</DashboardContext>
}
