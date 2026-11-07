'use client'

import type { Period } from '../dashboard-data'
import { useDashboard } from './use-dashboard'

const PERIODS: { value: Period; pc: string; sp: string }[] = [
  { value: 7, pc: '過去7日', sp: '7日' },
  { value: 30, pc: '過去30日', sp: '30日' },
  { value: 90, pc: '過去90日', sp: '90日' },
]

export function PeriodToggle({ compact = false }: { compact?: boolean }) {
  const { period, setPeriod } = useDashboard()

  return (
    <div
      role="group"
      aria-label="期間"
      className={`${compact ? 'grid grid-cols-3' : 'flex'} gap-1 p-1 bg-[#E6E9EE] rounded-[10px]`}
    >
      {PERIODS.map((p) => {
        const on = p.value === period
        return (
          <button
            key={p.value}
            type="button"
            aria-pressed={on}
            onClick={() => setPeriod(p.value)}
            className={`${compact ? '' : 'min-w-[72px] px-3.5'} min-h-10 rounded-[7px] text-[13px] font-bold cursor-pointer ${
              on ? 'bg-white text-[#14161A] shadow-[0_1px_2px_rgba(20,22,26,0.12)]' : 'text-[#464C57]'
            }`}
          >
            {compact ? p.sp : p.pc}
          </button>
        )
      })}
    </div>
  )
}
