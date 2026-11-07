'use client'

import { PcHeader } from './PcHeader'
import { RevenueBreakdown } from './RevenueBreakdown'
import { RevenueCardSp } from './RevenueCardSp'
import { RevenueChartPc } from './RevenueChartPc'
import { SpHeader } from './SpHeader'
import { EmptyState } from './EmptyState'
import { useDashboard } from './use-dashboard'
import { PC_PAGE, SP_MAIN, SP_PAGE } from './styles'

export function RevenueView() {
  const { view } = useDashboard()
  const empty = view.hasRevenue ? null : <EmptyState title="収益データはまだありません" />

  return (
    <>
      <div className={PC_PAGE}>
        <PcHeader title="収益" />
        {empty}
        <div className="flex flex-wrap gap-4">
          <RevenueChartPc className="flex-[2_1_520px]" />
          <RevenueBreakdown className="flex-1 basis-[300px]" />
        </div>
      </div>
      <div className={SP_PAGE}>
        <SpHeader title="収益" />
        <main className={SP_MAIN}>
          {empty}
          <RevenueCardSp />
          <RevenueBreakdown />
        </main>
      </div>
    </>
  )
}
