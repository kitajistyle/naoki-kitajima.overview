'use client'

import { use, useMemo } from 'react'
import { buildDashboardView, type DashboardView } from '../dashboard-data'
import { DashboardContext, type DashboardState } from './dashboard-context'

export function useDashboard(): DashboardState & { view: DashboardView } {
  const state = use(DashboardContext)
  if (!state) throw new Error('useDashboard must be used inside DashboardProvider')
  const { raw, period, sort, appIndex } = state
  const view = useMemo(() => buildDashboardView(raw, { period, sort, appIndex }), [raw, period, sort, appIndex])
  return { ...state, view }
}
