import type { CSSProperties } from 'react'
import type { DashboardView, Period, SortKey } from './dashboard-data'
import { Icon, type IconName } from './icons'

const vars = (o: Record<`--${string}`, string>): CSSProperties => o as CSSProperties

const PERIODS: { value: Period; label: string }[] = [
  { value: 7, label: '過去7日' },
  { value: 30, label: '過去30日' },
  { value: 90, label: '過去90日' },
]

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'total', label: '収益' },
  { value: 'dau', label: 'DAU' },
  { value: 'dl', label: 'ダウンロード' },
]

const NAV: { icon: IconName; label: string; current: boolean }[] = [
  { icon: 'overview', label: '概要', current: true },
  { icon: 'apps', label: 'アプリ別', current: false },
  { icon: 'revenue', label: '収益', current: false },
  { icon: 'users', label: 'ユーザー', current: false },
  { icon: 'settings', label: '設定', current: false },
]

const pill = (on: boolean) =>
  `min-h-9 px-3 rounded-full text-xs font-bold cursor-pointer border ${
    on ? 'bg-[#14161A] text-white border-[#14161A]' : 'bg-white text-[#464C57] border-[#D5D9E0]'
  }`

const th = 'font-medium py-2.5 px-3 border-b border-[#E3E6EB]'
const td = 'py-3.5 px-3 border-b border-[#EEF0F3]'

export function DashboardPc({
  view,
  period,
  sort,
  appIndex,
  onPeriod,
  onSort,
  onApp,
}: {
  view: DashboardView
  period: Period
  sort: SortKey
  appIndex: number
  onPeriod: (p: Period) => void
  onSort: (s: SortKey) => void
  onApp: (i: number) => void
}) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#14161A] font-sans flex flex-wrap items-stretch">
      <nav
        aria-label="メインメニュー"
        className="flex-1 basis-[220px] max-w-full bg-white border-r border-[#E3E6EB] px-4 py-6 flex flex-col gap-6"
      >
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-[#2456E8] flex items-center justify-center text-white">
            <Icon name="logo" strokeWidth={2.2} />
          </div>
          <div className="font-bold text-base">My Apps</div>
        </div>
        <div className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-current={item.current ? 'page' : undefined}
              className={`flex items-center gap-3 min-h-11 px-3 rounded-lg text-sm text-left cursor-pointer ${
                item.current ? 'bg-[#EAF0FF] text-[#163A9E] font-bold' : 'text-[#464C57]'
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-auto p-3 rounded-[10px] bg-[#F4F5F7] text-xs leading-[1.6] text-[#464C57]">
          データ連携：App Store Connect / Google Play Console / AdMob
        </div>
      </nav>

      <main className="flex-[999_1_560px] min-w-0 pt-8 px-10 pb-12 flex flex-col gap-6 max-w-[1240px]">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[26px] font-bold tracking-[0.01em]">概要</h1>
              <span className="text-[11px] font-bold text-[#7A4A00] bg-[#FFF1D6] px-2 py-[3px] rounded-full">
                サンプルデータ
              </span>
            </div>
            <p className="text-[13px] text-[#5B6270]">{view.rangeLabel} ・ 最終更新 2026/10/25 22:00</p>
          </div>
          <div role="group" aria-label="期間" className="flex gap-1 p-1 bg-[#E6E9EE] rounded-[10px]">
            {PERIODS.map((p) => {
              const on = p.value === period
              return (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onPeriod(p.value)}
                  className={`min-w-[72px] min-h-10 px-3.5 rounded-[7px] text-[13px] font-bold cursor-pointer ${
                    on ? 'bg-white text-[#14161A] shadow-[0_1px_2px_rgba(20,22,26,0.12)]' : 'text-[#464C57]'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </header>

        <section aria-label="主要指標" className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
          {view.kpis.map((k) => (
            <div
              key={k.label}
              className="bg-white border border-[#E3E6EB] rounded-[14px] p-5 flex flex-col gap-2.5"
            >
              <div className="text-[13px] text-[#5B6270] font-medium">{k.label}</div>
              <div className="font-mono text-3xl font-bold tabular-nums tracking-[-0.01em]">{k.value}</div>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="font-bold text-(--d-color) bg-(--d-bg) px-2 py-0.5 rounded-full"
                  style={vars({ '--d-color': k.dColor, '--d-bg': k.dBg })}
                >
                  {k.delta}
                </span>
                <span className="text-[#5B6270]">前期間比</span>
              </div>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap gap-4">
          <section
            aria-label="収益の推移"
            className="flex-[2_1_520px] min-w-0 bg-white border border-[#E3E6EB] rounded-[14px] px-6 py-5 flex flex-col gap-4"
          >
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-bold">収益の推移</h2>
                <span className="text-xs text-[#5B6270]">{view.bucketLabel}・全アプリ合計</span>
              </div>
              <div className="flex gap-4 text-xs text-[#464C57]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[#2456E8]" />
                  広告収益
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[#F0A04B]" />
                  アプリ内課金・サブスク
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col justify-between h-60 text-[11px] text-[#5B6270] text-right tabular-nums min-w-12">
                <span>{view.yTop}</span>
                <span>{view.yMid}</span>
                <span>¥0</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div
                  className="h-60 flex items-end gap-(--bar-gap) border-b border-[#D5D9E0] bg-[linear-gradient(#EEF0F3_1px,transparent_1px)] bg-[length:100%_120px]"
                  style={vars({ '--bar-gap': view.barGapPc })}
                >
                  {view.bars.map((b, i) => (
                    <div
                      key={i}
                      title={b.tip}
                      className="flex-1 min-w-0 h-full flex flex-col justify-end gap-0.5"
                    >
                      <div className="bg-[#F0A04B] rounded-t-[3px] h-(--iap-h)" style={vars({ '--iap-h': `${b.iapH}%` })} />
                      <div className="bg-[#2456E8] h-(--ad-h)" style={vars({ '--ad-h': `${b.adH}%` })} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-(--bar-gap)" style={vars({ '--bar-gap': view.barGapPc })}>
                  {view.bars.map((b, i) => (
                    <div
                      key={i}
                      className="flex-1 min-w-0 text-[11px] text-[#5B6270] text-center whitespace-nowrap overflow-visible"
                    >
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            aria-label="収益の内訳"
            className="flex-1 basis-[300px] min-w-0 bg-white border border-[#E3E6EB] rounded-[14px] px-6 py-5 flex flex-col gap-[18px]"
          >
            <h2 className="text-base font-bold">収益の内訳</h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex h-3.5 rounded-full overflow-hidden bg-[#EEF0F3]">
                <div className="bg-[#2456E8] w-(--ad-pct)" style={vars({ '--ad-pct': `${view.adPct}%` })} />
                <div className="bg-[#F0A04B] w-(--iap-pct)" style={vars({ '--iap-pct': `${view.iapPct}%` })} />
              </div>
              <div className="flex justify-between text-[13px]">
                <span>
                  広告 <strong className="font-mono">{view.adPct}%</strong>{' '}
                  <span className="text-[#5B6270]">{view.adTotal}</span>
                </span>
                <span>
                  課金 <strong className="font-mono">{view.iapPct}%</strong>{' '}
                  <span className="text-[#5B6270]">{view.iapTotal}</span>
                </span>
              </div>
            </div>
            <div className="h-px bg-[#E3E6EB]" />
            <h3 className="text-[13px] font-bold text-[#464C57]">アプリ別の収益シェア</h3>
            <div className="flex flex-col gap-3.5">
              {view.share.map((s) => (
                <div key={s.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[13px]">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full bg-(--app-color)"
                        style={vars({ '--app-color': s.color })}
                      />
                      {s.name}
                    </span>
                    <span className="font-mono tabular-nums font-semibold">
                      {s.rev} <span className="text-[#5B6270] font-medium">{s.pct}%</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EEF0F3]">
                    <div
                      className="h-1.5 w-(--pct) rounded-full bg-(--app-color)"
                      style={vars({ '--pct': `${s.pct}%`, '--app-color': s.color })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section
          aria-label="アプリ一覧"
          className="bg-white border border-[#E3E6EB] rounded-[14px] pt-5 pb-2 flex flex-col gap-3"
        >
          <div className="flex flex-wrap justify-between items-center gap-3 px-6">
            <h2 className="text-base font-bold">アプリ一覧</h2>
            <div role="group" aria-label="並び替え" className="flex items-center gap-1.5 text-xs text-[#5B6270]">
              並び替え
              {SORTS.map((o) => {
                const on = o.value === sort
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onSort(o.value)}
                    className={pill(on)}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-[13px] tabular-nums">
              <thead>
                <tr className="text-[#5B6270] text-xs text-right">
                  <th scope="col" className={`${th} text-left px-6`}>アプリ</th>
                  <th scope="col" className={`${th} text-left`}>プラットフォーム</th>
                  <th scope="col" className={th}>ダウンロード</th>
                  <th scope="col" className={th}>平均DAU</th>
                  <th scope="col" className={th}>保持率（7日後・iOSのみ）</th>
                  <th scope="col" className={th}>広告収益</th>
                  <th scope="col" className={th}>課金収益</th>
                  <th scope="col" className={th}>合計収益</th>
                  <th scope="col" className={`${th} pl-3 pr-6`}>前期間比</th>
                </tr>
              </thead>
              <tbody>
                {view.rows.map((r) => (
                  <tr key={r.name} className="text-right">
                    <th scope="row" className="text-left py-3.5 px-6 border-b border-[#EEF0F3] font-medium">
                      <span className="flex items-center gap-3">
                        <span
                          className="w-9 h-9 rounded-[9px] bg-(--app-color) text-white flex items-center justify-center font-mono font-bold text-[15px]"
                          style={vars({ '--app-color': r.color })}
                        >
                          {r.initial}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="font-bold text-[#14161A]">{r.name}</span>
                          <span className="text-xs text-[#5B6270]">{r.cat}</span>
                        </span>
                      </span>
                    </th>
                    <td className={`${td} text-left text-[#464C57]`}>{r.plat}</td>
                    <td className={td}>{r.dl}</td>
                    <td className={td}>{r.dau}</td>
                    <td className={td}>{r.ret}</td>
                    <td className={`${td} text-[#464C57]`}>{r.ad}</td>
                    <td className={`${td} text-[#464C57]`}>{r.iap}</td>
                    <td className={`${td} font-bold`}>{r.total}</td>
                    <td className={`${td} pl-3 pr-6`}>
                      <span
                        className="font-bold text-(--d-color) bg-(--d-bg) px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={vars({ '--d-color': r.dColor, '--d-bg': r.dBg })}
                      >
                        {r.delta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-label="離脱と継続"
          className="bg-white border border-[#E3E6EB] rounded-[14px] px-6 pt-5 pb-6 flex flex-col gap-5"
        >
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-bold">離脱と継続</h2>
              <span className="text-xs text-[#5B6270]">{view.exitApp}・無料で取れるデータだけで集計</span>
            </div>
            <div role="group" aria-label="アプリを選ぶ" className="flex flex-wrap gap-1.5">
              {view.appOptions.map((o, i) => {
                const on = i === appIndex
                return (
                  <button
                    key={o.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onApp(i)}
                    className={`${pill(on)} flex items-center gap-1.5`}
                  >
                    <span className="w-2 h-2 rounded-full bg-(--app-color)" style={vars({ '--app-color': o.color })} />
                    {o.name}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 basis-[380px] min-w-0 border border-[#E3E6EB] rounded-xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-[#5B6270] font-medium">30日離脱率</span>
                  <span className="font-mono text-[34px] font-bold tabular-nums">{view.churn}</span>
                  <span className="text-xs text-[#464C57]">
                    最後に開いてから30日以上たった人：{view.churnUsers}人 / {view.users}人
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#464C57] bg-[#F4F5F7] border border-[#E3E6EB] px-2 py-[3px] rounded-md whitespace-nowrap">
                  本番DB
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[#464C57]">最後にアプリを開いてからの日数</span>
                <div className="flex h-3.5 rounded-full overflow-hidden bg-[#EEF0F3] gap-0.5">
                  {view.buckets.map((b) => (
                    <div
                      key={b.label}
                      className="w-(--w) bg-(--bucket-color)"
                      style={vars({ '--w': `${b.w}%`, '--bucket-color': b.color })}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                {view.buckets.map((b) => (
                  <div key={b.label} className="flex justify-between items-center gap-2 text-[13px]">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-[3px] bg-(--bucket-color)"
                        style={vars({ '--bucket-color': b.color })}
                      />
                      {b.label}
                    </span>
                    <span className="font-mono tabular-nums">
                      <strong>{b.pct}</strong> <span className="text-[#5B6270]">{b.count}人</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-[1.7] text-[#5B6270]">
                push_tokens.updated_at（ログイン状態で起動するたびに更新）を「最後に開いた日時」として集計。テスター（ID 134〜233）は除外。
              </p>
            </div>

            <div className="flex-1 basis-[380px] min-w-0 border border-[#E3E6EB] rounded-xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-[#5B6270] font-medium">保持率（Retention）</span>
                  <span className="text-xs text-[#464C57]">インストールした人のうち、その後も使っている割合</span>
                </div>
                <span className="text-[11px] font-bold text-[#464C57] bg-[#F4F5F7] border border-[#E3E6EB] px-2 py-[3px] rounded-md whitespace-nowrap">
                  App Store Connect
                </span>
              </div>
              {view.hasIos ? (
                <>
                  <div className="flex flex-col gap-3">
                    {view.retention.map((r) => (
                      <div key={r.label} className="flex items-center gap-3 text-[13px]">
                        <span className="w-14 text-[#464C57]">{r.label}</span>
                        <span className="flex-1 h-2.5 rounded-full bg-[#EEF0F3] block">
                          <span className="block h-2.5 w-(--w) rounded-full bg-[#2456E8]" style={vars({ '--w': `${r.w}%` })} />
                        </span>
                        <strong className="font-mono min-w-12 text-right tabular-nums">{r.pct}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F4F5F7] rounded-[10px] px-3.5 py-3 flex flex-col gap-1">
                      <span className="text-xs text-[#5B6270]">アクティブデバイス数</span>
                      <span className="font-mono text-xl font-bold tabular-nums">{view.devices}</span>
                    </div>
                    <div className="bg-[#F4F5F7] rounded-[10px] px-3.5 py-3 flex flex-col gap-1">
                      <span className="text-xs text-[#5B6270]">削除数（{view.rangeShort}）</span>
                      <span className="font-mono text-xl font-bold tabular-nums">{view.deletions}</span>
                    </div>
                  </div>
                  <p className="text-[11px] leading-[1.7] text-[#5B6270]">データ共有に同意したユーザーだけが対象です。</p>
                </>
              ) : (
                <div className="bg-[#F4F5F7] rounded-[10px] p-4 text-[13px] leading-[1.7] text-[#464C57]">
                  このアプリは App Store で配信していないため、App Store Connect のデータはありません。
                </div>
              )}
              {view.hasAndroid && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-[10px] bg-[#EEF3FF] text-xs leading-[1.7] text-[#1D3A8A]">
                  <Icon name="info" size={16} className="shrink-0 mt-0.5" />
                  <span>Android はクローズドテスト中のため、Play Console の数字はまだほとんど出ません。</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#FFF8EC] border border-[#F5DDB0] rounded-xl px-4 py-3.5 flex flex-col gap-1.5 text-xs leading-[1.7] text-[#5C3B00]">
            <strong className="text-[13px]">この数字の限界</strong>
            <span>・通知を許可した人しか数えられません。拒否した人はトークンが登録されないためです。</span>
            <span>
              ・残るのは「最後に開いた日時」だけです。「登録から7日後も使っていたか」のような推移はさかのぼれないので、推移は右の保持率で確認します。
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}
