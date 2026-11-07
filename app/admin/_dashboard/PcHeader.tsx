'use client'

import { PeriodToggle } from './PeriodToggle'
import { useDashboard } from './use-dashboard'

export function PcHeader({ title, showPeriod = true }: { title: string; showPeriod?: boolean }) {
  const { view } = useDashboard()

  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-bold tracking-[0.01em]">{title}</h1>
        <p className="text-[13px] text-[#5B6270]">
          {showPeriod ? `${view.rangeLabel} ・ ` : ''}最終更新 {view.updatedPc}
        </p>
      </div>
      {showPeriod ? <PeriodToggle /> : null}
    </header>
  )
}
