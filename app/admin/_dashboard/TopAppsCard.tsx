'use client'

import Link from 'next/link'
import { appHref } from './app-href'
import { MoreLink } from './MoreLink'
import { useDashboard } from './use-dashboard'
import { CARD, vars } from './styles'

const TOP_N = 3

export function TopAppsCard({ className = '' }: { className?: string }) {
  const { view } = useDashboard()
  const top = view.cards.slice(0, TOP_N)

  return (
    <section aria-label="収益の多いアプリ" className={`${CARD} p-4 md:px-6 md:py-5 flex flex-col gap-4 min-w-0 ${className}`}>
      <div className="flex justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold">収益の多いアプリ</h2>
          <span className="text-xs text-[#5B6270]">上位{TOP_N}件 / 全{view.cards.length}件</span>
        </div>
        <MoreLink href="/admin/apps" />
      </div>
      <ol className="flex flex-col">
        {top.map((a, i) => (
          <li key={a.name} className="border-t border-[#EEF0F3] first:border-t-0">
            <Link
              href={appHref(a.name)}
              className="flex items-center gap-3 py-3 group"
            >
              <span className="w-4 font-mono text-xs text-[#5B6270]">{i + 1}</span>
              <span
                className="w-9 h-9 shrink-0 rounded-[9px] bg-(--app-color) text-white flex items-center justify-center font-mono font-bold text-[15px]"
                style={vars({ '--app-color': a.color })}
              >
                {a.initial}
              </span>
              <span className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span className="flex justify-between gap-2 text-[13px]">
                  <span className="font-bold truncate group-hover:text-[#2456E8]">{a.name}</span>
                  <span className="font-mono font-bold tabular-nums">{a.total}</span>
                </span>
                <span className="h-1.5 rounded-full bg-[#EEF0F3] block">
                  <span
                    className="h-1.5 w-(--pct) rounded-full bg-(--app-color) block"
                    style={vars({ '--pct': `${a.pct}%`, '--app-color': a.color })}
                  />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
