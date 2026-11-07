'use client'

import { PcHeader } from './PcHeader'
import { RevenueBreakdown } from './RevenueBreakdown'
import { RevenueCardSp } from './RevenueCardSp'
import { RevenueChartPc } from './RevenueChartPc'
import { SpHeader } from './SpHeader'
import { PC_PAGE, SP_MAIN, SP_PAGE } from './styles'

export function RevenueView() {
  return (
    <>
      <div className={PC_PAGE}>
        <PcHeader title="収益" />
        <div className="flex flex-wrap gap-4">
          <RevenueChartPc className="flex-[2_1_520px]" />
          <RevenueBreakdown className="flex-1 basis-[300px]" />
        </div>
      </div>
      <div className={SP_PAGE}>
        <SpHeader title="収益" />
        <main className={SP_MAIN}>
          <RevenueCardSp />
          <RevenueBreakdown />
        </main>
      </div>
    </>
  )
}
