import type { CSSProperties } from 'react'
import type { DashboardView, Period } from './dashboard-data'
import { Icon, type IconName } from './icons'

const vars = (o: Record<`--${string}`, string>): CSSProperties => o as CSSProperties

const PERIODS: { value: Period; label: string }[] = [
  { value: 7, label: '7日' },
  { value: 30, label: '30日' },
  { value: 90, label: '90日' },
]

const BOTTOM_NAV: { icon: IconName; label: string; current: boolean }[] = [
  { icon: 'overview', label: '概要', current: true },
  { icon: 'apps', label: 'アプリ', current: false },
  { icon: 'revenue', label: '収益', current: false },
  { icon: 'settings', label: '設定', current: false },
]

const pill = (on: boolean) =>
  `min-h-11 px-3.5 rounded-full text-[13px] font-bold cursor-pointer flex items-center gap-1.5 border ${
    on ? 'bg-[#14161A] text-white border-[#14161A]' : 'bg-white text-[#464C57] border-[#D5D9E0]'
  }`

export function DashboardSp({
  view,
  period,
  appIndex,
  onPeriod,
  onApp,
}: {
  view: DashboardView
  period: Period
  appIndex: number
  onPeriod: (p: Period) => void
  onApp: (i: number) => void
}) {
  return (
    <div className="w-full max-w-[520px] mx-auto min-h-screen bg-[#F4F5F7] text-[#14161A] font-sans flex flex-col">
      <header className="px-5 pt-[calc(16px+env(safe-area-inset-top))] pb-4 bg-white border-b border-[#E3E6EB] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">概要</p>
            </div>
            <span className="text-xs text-[#5B6270]">最終更新 {view.updatedSp}</span>
          </div>
          <button
            type="button"
            aria-label="データを更新"
            className="w-11 h-11 rounded-xl border border-[#E3E6EB] bg-white text-[#14161A] flex items-center justify-center cursor-pointer"
          >
            <Icon name="refresh" size={20} />
          </button>
        </div>
        <div role="group" aria-label="期間" className="grid grid-cols-3 gap-1 p-1 bg-[#E6E9EE] rounded-[10px]">
          {PERIODS.map((p) => {
            const on = p.value === period
            return (
              <button
                key={p.value}
                type="button"
                aria-pressed={on}
                onClick={() => onPeriod(p.value)}
                className={`min-h-10 border-0 rounded-[7px] text-[13px] font-bold cursor-pointer ${
                  on ? 'bg-white text-[#14161A] shadow-[0_1px_2px_rgba(20,22,26,0.12)]' : 'text-[#464C57]'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        <section aria-label="総収益" className="bg-[#14161A] text-white rounded-[18px] p-5 flex flex-col gap-3.5">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#C9CDD4]">総収益（{view.rangeShort}）</span>
            <span className="text-xs font-bold text-[#7EE2B5]">{view.revDelta}</span>
          </div>
          <div className="font-mono text-4xl font-bold tabular-nums tracking-[-0.01em]">{view.totalRev}</div>
          <div className="h-24 flex items-end gap-(--bar-gap)" style={vars({ '--bar-gap': view.barGapSp })}>
            {view.spBars.map((b, i) => (
              <div key={i} className="flex-1 min-w-0 h-full flex flex-col justify-end gap-px">
                <div className="bg-[#F0A04B] rounded-t-[2px] h-(--iap-h)" style={vars({ '--iap-h': `${b.iapH}%` })} />
                <div className="bg-[#6F93FF] h-(--ad-h)" style={vars({ '--ad-h': `${b.adH}%` })} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-[#C9CDD4]">
            <span>{view.startLabel}</span>
            <span>10/25</span>
          </div>
          <div className="flex gap-4 text-xs text-[#E6E8EC] pt-1 border-t border-[#2C3038]">
            <span className="flex items-center gap-1.5 pt-2.5">
              <span className="w-2 h-2 rounded-[2px] bg-[#6F93FF]" />
              広告 {view.adTotal}
            </span>
            <span className="flex items-center gap-1.5 pt-2.5">
              <span className="w-2 h-2 rounded-[2px] bg-[#F0A04B]" />
              課金 {view.iapTotal}
            </span>
          </div>
        </section>

        <section aria-label="主要指標" className="grid grid-cols-2 gap-3">
          {view.spKpis.map((k) => (
            <div key={k.label} className="bg-white border border-[#E3E6EB] rounded-[14px] p-3.5 flex flex-col gap-1.5">
              <span className="text-xs text-[#5B6270]">{k.label}</span>
              <span className="font-mono text-[22px] font-bold tabular-nums">{k.value}</span>
              <span
                className="self-start text-[11px] font-bold text-(--d-color) bg-(--d-bg) px-[7px] py-0.5 rounded-full"
                style={vars({ '--d-color': k.dColor, '--d-bg': k.dBg })}
              >
                {k.delta}
              </span>
            </div>
          ))}
        </section>

        <section aria-label="アプリ別" className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center px-1 pt-1">
            <h2 className="text-base font-bold">アプリ別</h2>
            <span className="text-xs text-[#5B6270]">収益の多い順</span>
          </div>
          {view.cards.map((a) => (
            <button
              key={a.name}
              type="button"
              className="w-full text-left bg-white border border-[#E3E6EB] rounded-[14px] p-3.5 flex flex-col gap-3 cursor-pointer text-[#14161A]"
            >
              <span className="flex items-center gap-3 w-full">
                <span
                  className="w-10 h-10 shrink-0 rounded-[10px] bg-(--app-color) text-white flex items-center justify-center font-mono font-bold text-base"
                  style={vars({ '--app-color': a.color })}
                >
                  {a.initial}
                </span>
                <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold">{a.name}</span>
                  <span className="text-xs text-[#5B6270]">{a.plat}</span>
                </span>
                <span className="flex flex-col items-end gap-[3px]">
                  <span className="font-mono text-[15px] font-bold tabular-nums">{a.total}</span>
                  <span className="text-[11px] font-bold text-(--d-color)" style={vars({ '--d-color': a.dColor })}>
                    {a.delta}
                  </span>
                </span>
              </span>
              <span className="h-1.5 w-full rounded-full bg-[#EEF0F3] block">
                <span
                  className="h-1.5 w-(--pct) rounded-full bg-(--app-color) block"
                  style={vars({ '--pct': `${a.pct}%`, '--app-color': a.color })}
                />
              </span>
              <span className="grid grid-cols-3 gap-2 w-full text-[11px] text-[#5B6270]">
                <span className="flex flex-col gap-0.5">
                  DL
                  <strong className="font-mono text-[13px] text-[#14161A] tabular-nums">{a.dl}</strong>
                </span>
                <span className="flex flex-col gap-0.5">
                  平均DAU
                  <strong className="font-mono text-[13px] text-[#14161A] tabular-nums">{a.dau}</strong>
                </span>
                <span className="flex flex-col gap-0.5">
                  保持率（7日後・iOSのみ）
                  <strong className="font-mono text-[13px] text-[#14161A] tabular-nums">{a.ret}</strong>
                </span>
              </span>
            </button>
          ))}
        </section>

        <section aria-label="離脱と継続" className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-0.5 px-1">
            <h2 className="text-base font-bold">離脱と継続</h2>
            <span className="text-xs text-[#5B6270]">無料で取れるデータだけで集計</span>
          </div>
          <div role="group" aria-label="アプリを選ぶ" className="flex gap-1.5 overflow-x-auto pb-0.5">
            {view.appOptions.map((o, i) => {
              const on = i === appIndex
              return (
                <button
                  key={o.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onApp(i)}
                  className={`${pill(on)} shrink-0`}
                >
                  <span className="w-2 h-2 rounded-full bg-(--app-color)" style={vars({ '--app-color': o.color })} />
                  {o.name}
                </button>
              )
            })}
          </div>

          <div className="bg-white border border-[#E3E6EB] rounded-[14px] p-4 flex flex-col gap-3.5">
            <div className="flex justify-between items-start gap-2">
              <span className="flex flex-col gap-0.5">
                <span className="text-xs text-[#5B6270]">30日離脱率</span>
                <span className="font-mono text-3xl font-bold tabular-nums">{view.churn}</span>
              </span>
              <span className="text-[10px] font-bold text-[#464C57] bg-[#F4F5F7] border border-[#E3E6EB] px-[7px] py-0.5 rounded-md">
                本番DB
              </span>
            </div>
            <span className="text-xs text-[#464C57]">
              30日以上開いていない人：{view.churnUsers}人 / {view.users}人
            </span>
            <div className="flex h-3 rounded-full overflow-hidden bg-[#EEF0F3] gap-0.5">
              {view.buckets.map((b) => (
                <div
                  key={b.label}
                  className="w-(--w) bg-(--bucket-color)"
                  style={vars({ '--w': `${b.w}%`, '--bucket-color': b.color })}
                />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {view.buckets.map((b) => (
                <div key={b.label} className="flex justify-between items-center text-[13px]">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-[3px] bg-(--bucket-color)"
                      style={vars({ '--bucket-color': b.color })}
                    />
                    最後に開いて{b.label}
                  </span>
                  <span className="font-mono tabular-nums">
                    <strong>{b.pct}</strong> <span className="text-[#5B6270]">{b.count}人</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] leading-[1.7] text-[#5B6270]">
              push_tokens.updated_at を最後に開いた日時として集計。テスター（ID 134〜233）は除外。
            </p>
          </div>

          <div className="bg-white border border-[#E3E6EB] rounded-[14px] p-4 flex flex-col gap-3.5">
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm font-bold">保持率（Retention）</span>
              <span className="text-[10px] font-bold text-[#464C57] bg-[#F4F5F7] border border-[#E3E6EB] px-[7px] py-0.5 rounded-md whitespace-nowrap">
                App Store Connect
              </span>
            </div>
            {view.hasIos ? (
              <>
                <div className="flex flex-col gap-2.5">
                  {view.retention.map((r) => (
                    <div key={r.label} className="flex items-center gap-2.5 text-[13px]">
                      <span className="w-[52px] text-[#464C57]">{r.label}</span>
                      <span className="flex-1 h-2 rounded-full bg-[#EEF0F3] block">
                        <span className="block h-2 w-(--w) rounded-full bg-[#2456E8]" style={vars({ '--w': `${r.w}%` })} />
                      </span>
                      <strong className="font-mono min-w-11 text-right tabular-nums">{r.pct}</strong>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F4F5F7] rounded-[10px] px-3 py-2.5 flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5B6270]">アクティブデバイス</span>
                    <span className="font-mono text-lg font-bold tabular-nums">{view.devices}</span>
                  </div>
                  <div className="bg-[#F4F5F7] rounded-[10px] px-3 py-2.5 flex flex-col gap-0.5">
                    <span className="text-[11px] text-[#5B6270]">削除数（{view.rangeShort}）</span>
                    <span className="font-mono text-lg font-bold tabular-nums">{view.deletions}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#5B6270]">データ共有に同意したユーザーだけが対象です。</p>
              </>
            ) : (
              <div className="bg-[#F4F5F7] rounded-[10px] p-3.5 text-xs leading-[1.7] text-[#464C57]">
                App Store で配信していないため、データはありません。
              </div>
            )}
            {view.hasAndroid && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-[10px] bg-[#EEF3FF] text-xs leading-[1.7] text-[#1D3A8A]">
                <Icon name="info" size={16} className="shrink-0 mt-0.5" />
                <span>Android はクローズドテスト中のため、数字はまだほとんど出ません。</span>
              </div>
            )}
          </div>

          <div className="bg-[#FFF8EC] border border-[#F5DDB0] rounded-[14px] p-3.5 flex flex-col gap-1.5 text-xs leading-[1.7] text-[#5C3B00]">
            <strong className="text-[13px]">この数字の限界</strong>
            <span>・通知を許可した人しか数えられません。</span>
            <span>・残るのは最後に開いた日時だけなので、日ごとの推移はさかのぼれません。推移は保持率で確認します。</span>
          </div>
        </section>
      </main>

      <nav
        aria-label="メインメニュー"
        className="sticky bottom-0 z-10 bg-white border-t border-[#E3E6EB] px-2 pt-1.5 pb-[calc(8px+env(safe-area-inset-bottom))] grid grid-cols-4 gap-1"
      >
        {BOTTOM_NAV.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-current={item.current ? 'page' : undefined}
            className={`min-h-[52px] flex flex-col items-center justify-center gap-1 text-[11px] cursor-pointer ${
              item.current ? 'text-[#2456E8] font-bold' : 'text-[#5B6270]'
            }`}
          >
            <Icon name={item.icon} size={22} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
