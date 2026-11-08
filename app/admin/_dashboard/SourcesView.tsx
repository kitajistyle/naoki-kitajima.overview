'use client'

import type { SourceState } from '../lib/types'
import { RefreshButton } from './RefreshButton'
import { SourceCard } from './SourceCard'
import { useDashboard } from './use-dashboard'
import { CARD, PC_PAGE, SP_MAIN, SP_PAGE } from './styles'

const ORDER: SourceState[] = ['error', 'partial', 'unconfigured', 'ok']
const SUMMARY: { state: SourceState; label: string }[] = [
  { state: 'ok', label: '取得成功' },
  { state: 'partial', label: '一部失敗' },
  { state: 'error', label: '取得失敗' },
  { state: 'unconfigured', label: '未設定' },
]

const fmt = (iso: string) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function SourcesView() {
  const { raw } = useDashboard()
  const sources = [...(raw.sources ?? [])].sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state))
  const checked = raw.checkedAt ? fmt(raw.checkedAt) : '—'

  const body = (
    <>
      <section aria-label="サマリー" className={`${CARD} p-4 md:px-6 md:py-5 grid grid-cols-4 gap-2`}>
        {SUMMARY.map((s) => (
          <div key={s.state} className="flex flex-col items-center gap-0.5">
            <span className="font-mono text-2xl font-bold tabular-nums">
              {sources.filter((x) => x.state === s.state).length}
            </span>
            <span className="text-[11px] text-[#5B6270]">{s.label}</span>
          </div>
        ))}
      </section>
      <p className="text-xs leading-[1.7] text-[#5B6270] px-1">
        最終チェック {checked}。結果は最大1時間キャッシュされます。環境変数を追加したら再デプロイすると反映されます。
      </p>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {sources.map((s) => (
          <SourceCard key={s.id} source={s} />
        ))}
      </div>
    </>
  )

  return (
    <>
      <div className={PC_PAGE}>
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[26px] font-bold tracking-[0.01em]">データソース</h1>
            <p className="text-[13px] text-[#5B6270]">各データソースから実際に取得できているか</p>
          </div>
          <RefreshButton withLabel />
        </header>
        {body}
      </div>
      <div className={SP_PAGE}>
        <header className="px-5 pt-[calc(16px+env(safe-area-inset-top))] pb-4 bg-white border-b border-[#E3E6EB] flex justify-between items-center gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">データソース</h1>
            <span className="text-xs text-[#5B6270]">各データソースから実際に取得できているか</span>
          </div>
          <RefreshButton />
        </header>
        <main className={SP_MAIN}>{body}</main>
      </div>
    </>
  )
}
