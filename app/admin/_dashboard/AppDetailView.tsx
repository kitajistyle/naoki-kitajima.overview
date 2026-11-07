'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { buildDashboardView } from '../dashboard-data'
import { AppSwitcher } from './AppSwitcher'
import { ChurnCard } from './ChurnCard'
import { DataLimitsNote } from './DataLimitsNote'
import { PeriodToggle } from './PeriodToggle'
import { RetentionCard } from './RetentionCard'
import { SpHeader } from './SpHeader'
import { useDashboard } from './use-dashboard'
import { CARD, PC_PAGE, SP_MAIN, SP_PAGE, vars } from './styles'

const PUSH_LABEL = {
  expo: 'サーバーPushあり',
  backend: 'バックエンドのみ（Push基盤なし）',
  local: 'ローカル通知のみ',
  web: 'Web（Push対象外）',
} as const

export function AppDetailView({ name }: { name: string }) {
  const { raw, period, sort } = useDashboard()
  const index = raw.apps.findIndex((a) => a.name === name)
  const app = raw.apps[index]
  // Same view builder, focused on this app (drives churn / retention cards)
  const view = useMemo(
    () => buildDashboardView(raw, { period, sort, appIndex: Math.max(index, 0) }),
    [raw, period, sort, index]
  )

  if (!app) {
    return (
      <div className="p-10 flex flex-col gap-4">
        <h1 className="text-xl font-bold">アプリが見つかりません</h1>
        <Link href="/admin/apps" className="text-sm font-bold text-[#2456E8]">
          ← アプリ別に戻る
        </Link>
      </div>
    )
  }

  const row = view.rows.find((r) => r.name === name)
  const share = view.share.find((s) => s.name === name)
  const hasRevenue = app.ad + app.iap > 0
  const adPct = hasRevenue ? Math.round((app.ad / (app.ad + app.iap)) * 100) : 0

  const kpis = [
    { label: 'ダウンロード', value: row?.dl ?? '—' },
    { label: '平均DAU', value: row?.dau ?? '—' },
    { label: '合計収益', value: row?.total ?? '—', badge: row },
    { label: '保持率（7日後・iOS）', value: row?.ret ?? '—' },
  ]

  const profile = (showName: boolean) => (
    <div className="flex items-center gap-3.5">
      <span
        className="w-12 h-12 shrink-0 rounded-[12px] bg-(--app-color) text-white flex items-center justify-center font-mono font-bold text-xl"
        style={vars({ '--app-color': app.deployed ? app.color : '#9AA4B2' })}
      >
        {app.name.slice(-1)}
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        {showName ? <h1 className="text-[26px] font-bold truncate">{app.name}</h1> : null}
        <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span className="px-2 py-0.5 rounded-md bg-[#EEF0F3] text-[#464C57]">{app.cat}</span>
          <span className="px-2 py-0.5 rounded-md bg-[#EEF0F3] text-[#464C57]">{app.plat}</span>
          <span
            className={`px-2 py-0.5 rounded-md ${app.deployed ? 'bg-[#E3F5EC] text-[#0B6B4B]' : 'bg-[#E6E9EE] text-[#5B6270]'}`}
          >
            {app.deployed ? '配信中' : '未デプロイ'}
          </span>
          {app.pushKind ? (
            <span className="px-2 py-0.5 rounded-md bg-[#EEF3FF] text-[#1D3A8A]">{PUSH_LABEL[app.pushKind]}</span>
          ) : null}
        </div>
      </div>
    </div>
  )

  const kpiGrid = (
    <section aria-label="このアプリの指標" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {kpis.map((k) => (
        <div key={k.label} className={`${CARD} p-3.5 md:p-5 flex flex-col gap-1.5 md:gap-2.5`}>
          <span className="text-xs md:text-[13px] text-[#5B6270]">{k.label}</span>
          <span className="font-mono text-[22px] md:text-3xl font-bold tabular-nums">{k.value}</span>
          {k.badge ? (
            <span
              className="self-start text-[11px] font-bold text-(--d-color) bg-(--d-bg) px-2 py-0.5 rounded-full"
              style={vars({ '--d-color': k.badge.dColor, '--d-bg': k.badge.dBg })}
            >
              {k.badge.delta} 前期間比
            </span>
          ) : null}
        </div>
      ))}
    </section>
  )

  const revenue = (
    <section aria-label="収益の構成" className={`${CARD} p-4 md:px-6 md:py-5 flex flex-col gap-4 min-w-0`}>
      <h2 className="text-base font-bold">収益の構成（{view.rangeShort}）</h2>
      <div className="flex flex-col gap-2.5">
        <div className="flex h-3.5 rounded-full overflow-hidden bg-[#EEF0F3]">
          <div className="bg-[#2456E8] w-(--ad-pct)" style={vars({ '--ad-pct': `${adPct}%` })} />
          {hasRevenue ? <div className="bg-[#F0A04B] flex-1" /> : null}
        </div>
        <div className="flex justify-between text-[13px]">
          <span>
            広告 <strong className="font-mono">{row?.ad}</strong>
          </span>
          <span>
            課金 <strong className="font-mono">{row?.iap}</strong>
          </span>
        </div>
      </div>
      <div className="h-px bg-[#E3E6EB]" />
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-[#464C57]">全アプリの収益に占める割合</span>
        <strong className="font-mono text-lg">{share?.pct ?? 0}%</strong>
      </div>
      <div className="h-1.5 rounded-full bg-[#EEF0F3]">
        <div
          className="h-1.5 w-(--pct) rounded-full bg-(--app-color)"
          style={vars({ '--pct': `${share?.pct ?? 0}%`, '--app-color': app.color })}
        />
      </div>
    </section>
  )

  return (
    <>
      <div className={PC_PAGE}>
        <Link href="/admin/apps" className="text-xs font-bold text-[#5B6270] hover:text-[#2456E8]">
          ← アプリ別
        </Link>
        <header className="flex flex-wrap items-end justify-between gap-4">
          {profile(true)}
          <PeriodToggle />
        </header>
        <AppSwitcher current={name} />
        {kpiGrid}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {revenue}
          <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChurnCard view={view} />
            <RetentionCard view={view} />
          </div>
        </div>
        <DataLimitsNote />
      </div>
      <div className={SP_PAGE}>
        <SpHeader title={app.name} />
        <main className={SP_MAIN}>
          <AppSwitcher current={name} scroll />
          {profile(false)}
          {kpiGrid}
          {revenue}
          <ChurnCard view={view} />
          <RetentionCard view={view} />
          <DataLimitsNote />
        </main>
      </div>
    </>
  )
}
