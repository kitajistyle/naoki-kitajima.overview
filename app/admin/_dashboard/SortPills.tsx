'use client'

import type { SortKey } from '../dashboard-data'
import { useDashboard } from './use-dashboard'
import { PILL_OFF, PILL_ON } from './styles'

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'total', label: '収益' },
  { value: 'dau', label: 'DAU' },
  { value: 'dl', label: 'ダウンロード' },
]

export function SortPills() {
  const { view, sort, setSort } = useDashboard()
  const available = SORTS.filter((o) =>
    o.value === 'total' ? view.columns.rev : o.value === 'dau' ? view.columns.dau : view.columns.dl
  )
  if (available.length < 2) return null

  return (
    <div role="group" aria-label="並び替え" className="flex items-center gap-1.5 text-xs text-[#5B6270]">
      並び替え
      {available.map((o) => {
        const on = o.value === sort
        return (
          <button key={o.value} type="button" aria-pressed={on} onClick={() => setSort(o.value)} className={on ? PILL_ON : PILL_OFF}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
