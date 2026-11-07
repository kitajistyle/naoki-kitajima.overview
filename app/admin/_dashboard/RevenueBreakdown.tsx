'use client'

import { useDashboard } from './use-dashboard'
import { CARD, vars } from './styles'

export function RevenueBreakdown({ className = '' }: { className?: string }) {
  const { view } = useDashboard()

  return (
    <section aria-label="収益の内訳" className={`${CARD} min-w-0 px-5 py-5 md:px-6 flex flex-col gap-[18px] ${className}`}>
      <h2 className="text-base font-bold">収益の内訳</h2>
      <div className="flex flex-col gap-2.5">
        <div className="flex h-3.5 rounded-full overflow-hidden bg-[#EEF0F3]">
          <div className="bg-[#2456E8] w-(--ad-pct)" style={vars({ '--ad-pct': `${view.adPct}%` })} />
          <div className="bg-[#F0A04B] w-(--iap-pct)" style={vars({ '--iap-pct': `${view.iapPct}%` })} />
        </div>
        <div className="flex justify-between text-[13px]">
          <span>
            広告 <strong className="font-mono">{view.adPct}%</strong>{' '}
            <span className="text-[#5B6270]">{view.adTotal}</span>
          </span>
          <span>
            課金 <strong className="font-mono">{view.iapPct}%</strong>{' '}
            <span className="text-[#5B6270]">{view.iapTotal}</span>
          </span>
        </div>
      </div>
      <div className="h-px bg-[#E3E6EB]" />
      <h3 className="text-[13px] font-bold text-[#464C57]">アプリ別の収益シェア</h3>
      <ul className="flex flex-col gap-3.5">
        {view.share.map((s) => (
          <li key={s.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-(--app-color)" style={vars({ '--app-color': s.color })} />
                {s.name}
              </span>
              <span className="font-mono tabular-nums font-semibold">
                {s.rev} <span className="text-[#5B6270] font-medium">{s.pct}%</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#EEF0F3]">
              <div
                className="h-1.5 w-(--pct) rounded-full bg-(--app-color)"
                style={vars({ '--pct': `${s.pct}%`, '--app-color': s.color })}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
