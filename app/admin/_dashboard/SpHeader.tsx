'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '../icons'
import { PeriodToggle } from './PeriodToggle'
import { useDashboard } from './use-dashboard'

export function SpHeader({ title, showPeriod = true }: { title: string; showPeriod?: boolean }) {
  const { view } = useDashboard()
  const router = useRouter()

  return (
    <header className="px-5 pt-[calc(16px+env(safe-area-inset-top))] pb-4 bg-white border-b border-[#E3E6EB] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          <span className="text-xs text-[#5B6270]">最終更新 {view.updatedSp}</span>
        </div>
        <button
          type="button"
          aria-label="データを更新"
          onClick={() => router.refresh()}
          className="w-11 h-11 rounded-xl border border-[#E3E6EB] bg-white text-[#14161A] flex items-center justify-center cursor-pointer"
        >
          <Icon name="refresh" size={20} />
        </button>
      </div>
      {showPeriod ? <PeriodToggle compact /> : null}
    </header>
  )
}
