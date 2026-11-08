'use client'

import { Icon } from '../icons'
import type { DashboardView } from '../dashboard-data'
import { useDashboard } from './use-dashboard'
import { CARD, SOURCE_TAG, vars } from './styles'

// Pass `view` to show a specific app; defaults to the app selected in context
export function RetentionCard({ view: viewProp }: { view?: DashboardView }) {
  const { view: ctxView } = useDashboard()
  const view = viewProp ?? ctxView
  if (!view.hasRetention) return null

  return (
    <section aria-label="保持率" className={`${CARD} p-4 md:p-5 flex flex-col gap-4 min-w-0`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-[13px] text-[#5B6270] font-medium">保持率（Retention）</h2>
          <span className="text-xs text-[#464C57]">インストールした人のうち、その後も使っている割合</span>
        </div>
        <span className={SOURCE_TAG}>App Store Connect</span>
      </div>
      <>
          <ul className="flex flex-col gap-3">
            {view.retention.map((r) => (
              <li key={r.label} className="flex items-center gap-3 text-[13px]">
                <span className="w-14 text-[#464C57]">{r.label}</span>
                <span className="flex-1 h-2.5 rounded-full bg-[#EEF0F3] block">
                  <span className="block h-2.5 w-(--w) rounded-full bg-[#2456E8]" style={vars({ '--w': `${r.w}%` })} />
                </span>
                <strong className="font-mono min-w-12 text-right tabular-nums">{r.pct}</strong>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F4F5F7] rounded-[10px] px-3.5 py-3 flex flex-col gap-1">
              <span className="text-xs text-[#5B6270]">アクティブデバイス数</span>
              <span className="font-mono text-xl font-bold tabular-nums">{view.devices}</span>
            </div>
            <div className="bg-[#F4F5F7] rounded-[10px] px-3.5 py-3 flex flex-col gap-1">
              <span className="text-xs text-[#5B6270]">削除数（{view.rangeShort}）</span>
              <span className="font-mono text-xl font-bold tabular-nums">{view.deletions}</span>
            </div>
          </div>
          <p className="text-[11px] leading-[1.7] text-[#5B6270]">データ共有に同意したユーザーだけが対象です。</p>
      </>
      {view.hasAndroid ? (
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-[10px] bg-[#EEF3FF] text-xs leading-[1.7] text-[#1D3A8A]">
          <Icon name="info" size={16} className="shrink-0 mt-0.5" />
          <span>Android はクローズドテスト中のため、Play Console の数字はまだほとんど出ません。</span>
        </div>
      ) : null}
    </section>
  )
}
