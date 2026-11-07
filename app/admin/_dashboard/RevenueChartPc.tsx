'use client'

import { MoreLink } from './MoreLink'
import { useDashboard } from './use-dashboard'
import { CARD, vars } from './styles'

export function RevenueChartPc({ moreHref, className = '' }: { moreHref?: string; className?: string }) {
  const { view } = useDashboard()

  return (
    <section aria-label="収益の推移" className={`${CARD} min-w-0 px-6 py-5 flex flex-col gap-4 ${className}`}>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold">収益の推移</h2>
          <span className="text-xs text-[#5B6270]">{view.bucketLabel}・全アプリ合計</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#464C57]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[#2456E8]" />
            広告収益
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[#F0A04B]" />
            アプリ内課金・サブスク
          </span>
          {moreHref ? <MoreLink href={moreHref} label="収益を見る" /> : null}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col justify-between h-60 text-[11px] text-[#5B6270] text-right tabular-nums min-w-12">
          <span>{view.yTop}</span>
          <span>{view.yMid}</span>
          <span>¥0</span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div
            className="h-60 flex items-end gap-(--bar-gap) border-b border-[#D5D9E0] bg-[linear-gradient(#EEF0F3_1px,transparent_1px)] bg-[length:100%_120px]"
            style={vars({ '--bar-gap': view.barGapPc })}
          >
            {view.bars.map((b, i) => (
              <div key={i} title={b.tip} className="flex-1 min-w-0 h-full flex flex-col justify-end gap-0.5">
                <div className="bg-[#F0A04B] rounded-t-[3px] h-(--iap-h)" style={vars({ '--iap-h': `${b.iapH}%` })} />
                <div className="bg-[#2456E8] h-(--ad-h)" style={vars({ '--ad-h': `${b.adH}%` })} />
              </div>
            ))}
          </div>
          <div className="flex gap-(--bar-gap)" style={vars({ '--bar-gap': view.barGapPc })}>
            {view.bars.map((b, i) => (
              <div
                key={i}
                className="flex-1 min-w-0 text-[11px] text-[#5B6270] text-center whitespace-nowrap overflow-visible"
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
