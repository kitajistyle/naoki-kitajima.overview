'use client'

import Link from 'next/link'
import type { AppCard } from '../dashboard-data'
import { appHref } from './app-href'
import { vars } from './styles'

export function AppCardSp({ app, detailed = true }: { app: AppCard; detailed?: boolean }) {
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
        <span className="flex flex-col items-end gap-[3px]">
          <span className="font-mono text-[15px] font-bold tabular-nums">{app.total}</span>
          <span className="text-[11px] font-bold text-(--d-color)" style={vars({ '--d-color': app.dColor })}>
            {app.delta}
          </span>
        </span>
      </span>
      <span className="h-1.5 w-full rounded-full bg-[#EEF0F3] block">
        <span
          className="h-1.5 w-(--pct) rounded-full bg-(--app-color) block"
          style={vars({ '--pct': `${app.pct}%`, '--app-color': app.color })}
        />
      </span>
      {detailed ? (
        <span className="grid grid-cols-3 gap-2 w-full text-[11px] text-[#5B6270]">
          <span className="flex flex-col gap-0.5">
            DL
            <strong className="font-mono text-[13px] text-[#14161A] tabular-nums">{app.dl}</strong>
          </span>
          <span className="flex flex-col gap-0.5">
            平均DAU
            <strong className="font-mono text-[13px] text-[#14161A] tabular-nums">{app.dau}</strong>
          </span>
          <span className="flex flex-col gap-0.5">
            保持率（7日後・iOS）
            <strong className="font-mono text-[13px] text-[#14161A] tabular-nums">{app.ret}</strong>
          </span>
        </span>
      ) : null}
    </Link>
  )
}
