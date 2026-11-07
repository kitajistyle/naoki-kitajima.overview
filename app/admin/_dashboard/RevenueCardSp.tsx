'use client'

import Link from 'next/link'
import { useDashboard } from './use-dashboard'
import { vars } from './styles'

export function RevenueCardSp({ moreHref }: { moreHref?: string }) {
  const { view } = useDashboard()

  return (
    <section aria-label="総収益" className="bg-[#14161A] text-white rounded-[18px] p-5 flex flex-col gap-3.5">
      <div className="flex justify-between items-center">
        <span className="text-[13px] text-[#C9CDD4]">総収益（{view.rangeShort}）</span>
        <span className="text-xs font-bold text-[#7EE2B5]">{view.revDelta}</span>
      </div>
      <div className="font-mono text-4xl font-bold tabular-nums tracking-[-0.01em]">{view.totalRev}</div>
      <div className="h-24 flex items-end gap-(--bar-gap)" style={vars({ '--bar-gap': view.barGapSp })}>
        {view.spBars.map((b, i) => (
          <div key={i} className="flex-1 min-w-0 h-full flex flex-col justify-end gap-px">
            <div className="bg-[#F0A04B] rounded-t-[2px] h-(--iap-h)" style={vars({ '--iap-h': `${b.iapH}%` })} />
            <div className="bg-[#6F93FF] h-(--ad-h)" style={vars({ '--ad-h': `${b.adH}%` })} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-[#C9CDD4]">
        <span>{view.startLabel}</span>
        <span>{view.bars.at(-1)?.label}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-[#E6E8EC] pt-1 border-t border-[#2C3038]">
        <span className="flex items-center gap-1.5 pt-2.5">
          <span className="w-2 h-2 rounded-[2px] bg-[#6F93FF]" />
          広告 {view.adTotal}
        </span>
        <span className="flex items-center gap-1.5 pt-2.5">
          <span className="w-2 h-2 rounded-[2px] bg-[#F0A04B]" />
          課金 {view.iapTotal}
        </span>
        {moreHref ? (
          <Link href={moreHref} className="ml-auto pt-2.5 font-bold text-[#9DB5F5]">
            内訳 →
          </Link>
        ) : null}
      </div>
    </section>
  )
}
