'use client'

import { useDashboard } from './use-dashboard'
import { vars } from './styles'

export function KpiGridSp() {
  const { view } = useDashboard()
  if (view.spKpis.length === 0) return null

  return (
    <section aria-label="主要指標" className="grid grid-cols-2 gap-3">
      {view.spKpis.map((k) => (
        <div key={k.label} className="bg-white border border-[#E3E6EB] rounded-[14px] p-3.5 flex flex-col gap-1.5">
          <span className="text-xs text-[#5B6270]">{k.label}</span>
          <span className="font-mono text-[22px] font-bold tabular-nums">{k.value}</span>
          {k.delta !== '—' ? (
          <span
            className="self-start text-[11px] font-bold text-(--d-color) bg-(--d-bg) px-[7px] py-0.5 rounded-full"
            style={vars({ '--d-color': k.dColor, '--d-bg': k.dBg })}
          >
            {k.delta}
          </span>
          ) : null}
        </div>
      ))}
    </section>
  )
}
