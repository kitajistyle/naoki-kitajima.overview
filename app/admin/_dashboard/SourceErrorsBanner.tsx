'use client'

import Link from 'next/link'
import { Icon } from '../icons'
import { useDashboard } from './use-dashboard'

// Points to /admin/sources whenever a source failed or is not configured
export function SourceErrorsBanner() {
  const { raw } = useDashboard()
  const sources = raw.sources ?? []
  const failed = sources.filter((s) => s.state === 'error' || s.state === 'partial').length
  const unconfigured = sources.filter((s) => s.state === 'unconfigured').length
  if (failed === 0 && unconfigured === 0) return null

  return (
    <Link
      href="/admin/sources"
      className={`flex items-center gap-2.5 px-4 py-3 rounded-[12px] border text-xs leading-[1.6] ${
        failed > 0 ? 'bg-[#FCE8E6] border-[#F3C7C2] text-[#7A1B16]' : 'bg-white border-[#E3E6EB] text-[#464C57]'
      }`}
    >
      <Icon name="database" size={16} className="shrink-0" />
      <span className="flex-1">
        データソース：
        {failed > 0 ? <strong>{failed}件 取得失敗</strong> : null}
        {failed > 0 && unconfigured > 0 ? ' / ' : null}
        {unconfigured > 0 ? <span>{unconfigured}件 未設定</span> : null}
      </span>
      <span className="font-bold whitespace-nowrap">確認する →</span>
    </Link>
  )
}
