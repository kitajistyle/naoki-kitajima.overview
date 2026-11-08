'use client'

import { ChurnSummaryCard } from './ChurnSummaryCard'
import { EmptyState } from './EmptyState'
import { KpiGridPc } from './KpiGridPc'
import { KpiGridSp } from './KpiGridSp'
import { PcHeader } from './PcHeader'
import { RevenueCardSp } from './RevenueCardSp'
import { SourceErrorsBanner } from './SourceErrorsBanner'
import { RevenueChartPc } from './RevenueChartPc'
import { SpHeader } from './SpHeader'
import { TopAppsCard } from './TopAppsCard'
import { useDashboard } from './use-dashboard'
import { PC_PAGE, SP_MAIN, SP_PAGE } from './styles'

// Overview = a glance at everything; each card links to its detail page
export function OverviewView() {
  const { view } = useDashboard()
  const isEmpty =
    view.kpis.length === 0 && view.spKpis.length === 0 && !view.hasRevenue && !view.hasChurn && !view.hasRetention

  return (
    <>
      <div className={PC_PAGE}>
        <PcHeader title="概要" />
        <SourceErrorsBanner />
        {isEmpty ? <EmptyState /> : null}
        <KpiGridPc />
        <RevenueChartPc moreHref="/admin/revenue" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TopAppsCard />
          <ChurnSummaryCard />
        </div>
      </div>
      <div className={SP_PAGE}>
        <SpHeader title="概要" />
        <main className={SP_MAIN}>
          <SourceErrorsBanner />
          {isEmpty ? <EmptyState /> : null}
          <RevenueCardSp moreHref="/admin/revenue" />
          <KpiGridSp />
          <TopAppsCard />
          <ChurnSummaryCard />
        </main>
      </div>
    </>
  )
}
