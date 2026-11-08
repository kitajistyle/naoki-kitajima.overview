'use client'

import type { DashboardView } from '../dashboard-data'
import { useDashboard } from './use-dashboard'
import { CARD, SOURCE_TAG, vars } from './styles'

// Pass `view` to show a specific app; defaults to the app selected in context
export function ChurnCard({ view: viewProp }: { view?: DashboardView }) {
  const { view: ctxView } = useDashboard()
  const view = viewProp ?? ctxView
  if (!view.hasChurn) return null

  return (
    <section aria-label="30日離脱率" className={`${CARD} p-4 md:p-5 flex flex-col gap-4 min-w-0`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-[13px] text-[#5B6270] font-medium">30日離脱率</h2>
          <span className="font-mono text-3xl md:text-[34px] font-bold tabular-nums">{view.churn}</span>
          <span className="text-xs text-[#464C57]">
            最後に開いてから30日以上たった人：{view.churnUsers}人 / {view.users}人
          </span>
        </div>
        <span className={SOURCE_TAG}>本番DB</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-[#464C57]">最後にアプリを開いてからの日数</span>
        <div className="flex h-3.5 rounded-full overflow-hidden bg-[#EEF0F3] gap-0.5">
          {view.buckets.map((b) => (
            <div key={b.label} className="w-(--w) bg-(--bucket-color)" style={vars({ '--w': `${b.w}%`, '--bucket-color': b.color })} />
          ))}
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
        {view.buckets.map((b) => (
          <li key={b.label} className="flex justify-between items-center gap-2 text-[13px]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-(--bucket-color)" style={vars({ '--bucket-color': b.color })} />
              {b.label}
            </span>
            <span className="font-mono tabular-nums">
              <strong>{b.pct}</strong> <span className="text-[#5B6270]">{b.count}人</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] leading-[1.7] text-[#5B6270]">
        push_tokens.updated_at（ログイン状態で起動するたびに更新）を「最後に開いた日時」として集計。テスター（ID 134〜233）は除外。
      </p>
    </section>
  )
}
