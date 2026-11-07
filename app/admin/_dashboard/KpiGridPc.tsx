'use client'

import { useDashboard } from './use-dashboard'
import { CARD, vars } from './styles'

export function KpiGridPc() {
  const { view } = useDashboard()
  if (view.kpis.length === 0) return null

  return (
    <section aria-label="主要指標" className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
      {view.kpis.map((k) => (
        <div key={k.label} className={`${CARD} p-5 flex flex-col gap-2.5`}>
          <div className="text-[13px] text-[#5B6270] font-medium">{k.label}</div>
          <div className="font-mono text-3xl font-bold tabular-nums tracking-[-0.01em]">{k.value}</div>
          {k.delta !== '—' ? (
          <div className="flex items-center gap-2 text-xs">
            <span
              className="font-bold text-(--d-color) bg-(--d-bg) px-2 py-0.5 rounded-full"
              style={vars({ '--d-color': k.dColor, '--d-bg': k.dBg })}
            >
              {k.delta}
            </span>
            <span className="text-[#5B6270]">前期間比</span>
          </div>
          ) : null}
        </div>
      ))}
    </section>
  )
}
