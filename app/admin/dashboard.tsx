'use client'

import { useState } from 'react'
import { buildDashboardView, type Period, type SortKey } from './dashboard-data'
import type { AdminRaw } from './lib/types'
import { DashboardPc } from './dashboard-pc'
import { DashboardSp } from './dashboard-sp'

export function Dashboard({ raw }: { raw: AdminRaw }) {
  const [period, setPeriod] = useState<Period>(30)
  const [sort, setSort] = useState<SortKey>('total')
  const [appIndex, setAppIndex] = useState(0)

  const view = buildDashboardView(raw, { period, sort, appIndex })

  return (
    <>
      <div className="hidden md:block">
        <DashboardPc
          view={view}
          period={period}
          sort={sort}
          appIndex={appIndex}
          onPeriod={setPeriod}
          onSort={setSort}
          onApp={setAppIndex}
        />
      </div>
      <div className="md:hidden">
        <DashboardSp view={view} period={period} appIndex={appIndex} onPeriod={setPeriod} onApp={setAppIndex} />
      </div>
    </>
  )
}
