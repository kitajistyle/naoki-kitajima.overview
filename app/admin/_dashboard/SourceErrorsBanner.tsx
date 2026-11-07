'use client'

import { Icon } from '../icons'
import { useDashboard } from './use-dashboard'

export function SourceErrorsBanner() {
  const { raw } = useDashboard()
  const errors = raw.errors ?? []
  if (errors.length === 0) return null

  return (
    <aside className="flex items-start gap-2.5 px-4 py-3 rounded-[12px] bg-[#FCE8E6] border border-[#F3C7C2] text-xs leading-[1.7] text-[#7A1B16]">
      <Icon name="info" size={16} className="shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <strong className="text-[13px]">一部のデータ取得に失敗しました（{errors.length}件）</strong>
        <ul>
          {errors.map((e) => (
            <li key={e}>・{e}</li>
          ))}
        </ul>
        <span className="text-[#A3241F]">該当する数字は — または 0 と表示されています。</span>
      </div>
    </aside>
  )
}
