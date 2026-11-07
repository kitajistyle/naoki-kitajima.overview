'use client'

import { MoreLink } from './MoreLink'
import { useDashboard } from './use-dashboard'
import { CARD, vars } from './styles'

export function ChurnSummaryCard({ className = '' }: { className?: string }) {
  const { view } = useDashboard()
  if (!view.hasChurn && !view.hasRetention) return null
  const d7 = view.retention.find((r) => r.label === '7日後')

  return (
    <section aria-label="離脱と継続" className={`${CARD} p-4 md:px-6 md:py-5 flex flex-col gap-4 min-w-0 ${className}`}>
      <div className="flex justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold">離脱と継続</h2>
          <span className="text-xs text-[#5B6270]">{view.exitApp}</span>
        </div>
        <MoreLink href="/admin/users" label="詳しく見る" />
      </div>
      <div className="flex items-end gap-6">
        {view.hasChurn ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[#5B6270]">30日離脱率</span>
            <span className="font-mono text-3xl font-bold tabular-nums">{view.churn}</span>
          </div>
        ) : null}
        {d7 ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[#5B6270]">保持率（7日後）</span>
            <span className="font-mono text-3xl font-bold tabular-nums">{d7.pct}</span>
          </div>
        ) : null}
      </div>
      {view.hasChurn ? (
        <>
          <div className="flex h-2.5 rounded-full overflow-hidden bg-[#EEF0F3] gap-0.5">
            {view.buckets.map((b) => (
              <div key={b.label} className="w-(--w) bg-(--bucket-color)" style={vars({ '--w': `${b.w}%`, '--bucket-color': b.color })} />
            ))}
          </div>
          <span className="text-xs text-[#464C57]">
            30日以上開いていない人：{view.churnUsers}人 / {view.users}人
          </span>
        </>
      ) : null}
    </section>
  )
}
