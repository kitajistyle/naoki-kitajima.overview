import type { SourceState, SourceStatus } from '../lib/types'
import { CARD } from './styles'

const STATE: Record<SourceState, { label: string; cls: string; dot: string }> = {
  ok: { label: '取得成功', cls: 'bg-[#E3F5EC] text-[#0B6B4B]', dot: 'bg-[#16A34A]' },
  partial: { label: '一部失敗', cls: 'bg-[#FFF3DC] text-[#8A5300]', dot: 'bg-[#F0A04B]' },
  error: { label: '取得失敗', cls: 'bg-[#FCE8E6] text-[#A3241F]', dot: 'bg-[#DC2626]' },
  unconfigured: { label: '未設定', cls: 'bg-[#E6E9EE] text-[#464C57]', dot: 'bg-[#9AA4B2]' },
}

export function SourceCard({ source }: { source: SourceStatus }) {
  const st = STATE[source.state]

  return (
    <section aria-label={source.name} className={`${CARD} p-4 md:p-5 flex flex-col gap-3.5 min-w-0`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
            {source.name}
          </h2>
          <p className="text-xs text-[#5B6270]">{source.provides.join(' / ')}</p>
        </div>
        <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md ${st.cls}`}>{st.label}</span>
      </div>

      {source.state === 'unconfigured' ? (
        <div className="flex flex-col gap-1.5 text-xs text-[#464C57]">
          <span>足りない環境変数（Vercel の Production に追加してください）</span>
          <ul className="flex flex-wrap gap-1.5">
            {source.missing.map((m) => (
              <li key={m}>
                <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#F4F5F7] border border-[#E3E6EB]">{m}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {source.messages.length > 0 ? (
        <ul className="flex flex-col gap-1 text-xs leading-[1.6] text-[#A3241F]">
          {source.messages.map((m) => (
            <li key={m}>・{m}</li>
          ))}
        </ul>
      ) : null}

      {source.state === 'ok' || source.state === 'partial' ? (
        <div className="flex flex-col gap-1 text-xs text-[#464C57]">
          <span>
            データを返したアプリ：
            {source.apps.length > 0 ? <strong className="text-[#14161A]">{source.apps.join('、')}</strong> : 'なし'}
          </span>
          {source.dailyRows > 0 ? <span>日別データ：{source.dailyRows}日分</span> : null}
        </div>
      ) : null}
    </section>
  )
}
