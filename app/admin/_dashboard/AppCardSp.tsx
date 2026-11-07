'use client'

import Link from 'next/link'
import type { AppCard } from '../dashboard-data'
import { appHref } from './app-href'
import { vars } from './styles'

export function AppCardSp({ app, detailed = true }: { app: AppCard; detailed?: boolean }) {
  const metrics = [
    { label: 'DL', value: app.dl },
    { label: '平均DAU', value: app.dau },
    { label: '保持率（7日後・iOS）', value: app.ret },
  ].filter((m): m is { label: string; value: string } => m.value !== null)

  return (
    <Link
      href={appHref(app.name)}
      className="w-full bg-white border border-[#E3E6EB] rounded-[14px] p-3.5 flex flex-col gap-3 text-[#14161A] active:bg-[#F8F9FB]"
    >
      <span className="flex items-center gap-3 w-full">
        <span
          className="w-10 h-10 shrink-0 rounded-[10px] bg-(--app-color) text-white flex items-center justify-center font-mono font-bold text-base"
          style={vars({ '--app-color': app.color })}
        >
          {app.initial}
        </span>
        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className="text-[15px] font-bold truncate">{app.name}</span>
          <span className="text-xs text-[#5B6270]">{app.plat}</span>
        </span>
        {app.total !== null || app.hasDelta ? (
          <span className="flex flex-col items-end gap-[3px]">
            {app.total !== null ? <span className="font-mono text-[15px] font-bold tabular-nums">{app.total}</span> : null}
            {app.hasDelta ? (
              <span className="text-[11px] font-bold text-(--d-color)" style={vars({ '--d-color': app.dColor })}>
                {app.delta}
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
      {app.total !== null ? (
      <span className="h-1.5 w-full rounded-full bg-[#EEF0F3] block">
        <span
          className="h-1.5 w-(--pct) rounded-full bg-(--app-color) block"
          style={vars({ '--pct': `${app.pct}%`, '--app-color': app.color })}
        />
      </span>
      ) : null}
      {detailed && metrics.length > 0 ? (
        <span className="grid grid-cols-3 gap-2 w-full text-[11px] text-[#5B6270]">
          {metrics.map((m) => (
            <span key={m.label} className="flex flex-col gap-0.5">
              {m.label}
              <strong className="font-mono text-[13px] text-[#14161A] tabular-nums">{m.value}</strong>
            </span>
          ))}
        </span>
      ) : null}
    </Link>
  )
}
