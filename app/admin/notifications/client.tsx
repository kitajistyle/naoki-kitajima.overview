'use client'

import { useState } from 'react'
import { CARD, PILL_OFF, PILL_ON, vars } from '../_dashboard/styles'

interface AlertRule {
  enabled: boolean
  threshold?: number
  comment?: string
}

interface EvalResult {
  alerts: { level: string; text: string }[]
  digest: string | null
  sent: { kind: string; results: { channel: string; ok: boolean; detail?: string }[] }[]
}

type PushResult = { results: { app: string; ok: boolean; targets?: number; invalidRemoved?: number; error?: string }[] } | { error: string }

// Same vocabulary as the dashboard pages (SourceCard / SourcesView / AppTablePc)
const h2 = 'text-base font-bold flex items-center gap-2'
const sub = 'text-xs text-[#5B6270] leading-[1.7]'
const divider = 'border-t border-[#EEF0F3] pt-4'
const code = 'font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#F4F5F7] border border-[#E3E6EB]'
const btn = `${PILL_OFF} justify-center px-4 hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed`
const btnPrimary = `${PILL_ON} justify-center px-4 hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed`
const field =
  'min-h-11 rounded-[10px] border border-[#D5D9E0] bg-white px-3 text-sm font-normal text-[#14161A] placeholder:text-[#9AA4B2] focus:outline-none focus:border-[#2456E8] focus:ring-2 focus:ring-[#2456E8]/15'
const label = 'flex flex-col gap-1.5 text-xs font-bold text-[#464C57]'
const result = 'bg-[#F4F5F7] border border-[#E3E6EB] rounded-[10px] p-3 text-xs leading-[1.7] font-mono whitespace-pre-wrap'
const badge = (on: boolean) =>
  `shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${on ? 'bg-[#E3F5EC] text-[#0B6B4B]' : 'bg-[#E6E9EE] text-[#464C57]'}`
const dot = (on: boolean) => `w-2 h-2 rounded-full shrink-0 ${on ? 'bg-[#16A34A]' : 'bg-[#9AA4B2]'}`

type PushKind = 'expo' | 'backend' | 'local' | 'web'

const PUSH_LABEL: Record<PushKind, string> = {
  expo: '送信可',
  backend: '基盤なし',
  local: 'ローカルのみ',
  web: '対象外',
}

export function NotificationsClient({
  channels,
  rules,
  pushApps,
  apps,
}: {
  channels: string[]
  rules: { digest: { enabled: boolean }; alerts: Record<string, AlertRule>; apps: Record<string, { alerts?: boolean; digest?: boolean }> }
  pushApps: string[]
  apps: { name: string; cat: string; color: string; deployed: boolean; pushKind?: PushKind }[]
}) {
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null)
  const [evalBusy, setEvalBusy] = useState<'eval' | 'test' | null>(null)
  const [app, setApp] = useState<string>('all')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [pushResult, setPushResult] = useState<PushResult | null>(null)
  const [pushBusy, setPushBusy] = useState(false)

  const callNotify = async (send: boolean, kind: 'eval' | 'test') => {
    setEvalBusy(kind)
    try {
      const res = await fetch('/admin/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ send }),
      })
      setEvalResult(await res.json())
    } finally {
      setEvalBusy(null)
    }
  }

  const sendPush = async () => {
    setPushBusy(true)
    setPushResult(null)
    try {
      const res = await fetch('/admin/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app, title, body }),
      })
      setPushResult(await res.json())
    } finally {
      setPushBusy(false)
    }
  }

  const CHANNELS = ['Discord', 'ntfy', 'LINE']
  const RULE_LABELS: Record<string, string> = {
    endpointDown: '取得先の障害',
    revDropPct: `収益が前期間比 ${rules.alerts.revDropPct?.threshold ?? ''}% 低下`,
    dauBelow: `平均DAUが ${rules.alerts.dauBelow?.threshold ?? ''} 人未満`,
    metricsMissing: '指標が取れていないアプリ',
  }
  const ruleList = Object.entries(rules.alerts)
  const summary = [
    { value: `${channels.length}/${CHANNELS.length}`, label: '届け先チャネル' },
    { value: `${ruleList.filter(([, r]) => r.enabled).length}/${ruleList.length}`, label: '有効なアラート' },
    { value: rules.digest.enabled ? 'ON' : 'OFF', label: '日次サマリー' },
    { value: String(pushApps.length), label: 'Push対応アプリ' },
  ]

  return (
    <div className="w-full max-w-[520px] mx-auto md:max-w-[1240px] md:pt-8 md:px-10 md:pb-12 flex flex-col md:gap-6">
      <header className="px-5 pt-[calc(16px+env(safe-area-inset-top))] pb-4 bg-white border-b border-[#E3E6EB] md:p-0 md:bg-transparent md:border-0 flex flex-col gap-1 md:gap-1.5">
        <h1 className="text-2xl md:text-[26px] font-bold md:tracking-[0.01em]">通知設定</h1>
        <p className="text-xs md:text-[13px] text-[#5B6270]">管理者アラートとユーザー向けPush送信</p>
      </header>

      <main className="p-4 md:p-0 flex flex-col gap-4 md:gap-6">
        <section aria-label="サマリー" className={`${CARD} p-4 md:px-6 md:py-5 grid grid-cols-4 gap-2`}>
          {summary.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 text-center">
              <span className="font-mono text-2xl font-bold tabular-nums">{s.value}</span>
              <span className="text-[11px] text-[#5B6270]">{s.label}</span>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
          <section aria-label="管理者アラート" className={`${CARD} p-4 md:p-5 flex flex-col gap-4 min-w-0`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <h2 className={h2}>
                  <span className={dot(channels.length > 0)} />
                  管理者アラート
                </h2>
                <p className="text-xs text-[#5B6270]">Vercel Cron で毎朝（JST 8:00）評価します</p>
              </div>
              <span className={badge(channels.length > 0)}>{channels.length > 0 ? '有効' : 'チャネル未設定'}</span>
            </div>

            <ul aria-label="届け先チャネル" className="grid grid-cols-3 gap-2">
              {CHANNELS.map((c) => {
                const on = channels.includes(c)
                return (
                  <li key={c} className="flex flex-col items-start gap-1.5 rounded-[10px] border border-[#E3E6EB] px-3 py-2.5">
                    <span className="text-[13px] font-bold">{c}</span>
                    <span className={badge(on)}>{on ? '設定済み' : '未設定'}</span>
                  </li>
                )
              })}
            </ul>

            <ul aria-label="アラートルール" className={`${divider} flex flex-col`}>
              <li className="flex items-center justify-between gap-3 py-2 text-[13px]">
                <span>日次サマリー（収益・DAU・DL）</span>
                <span className={badge(rules.digest.enabled)}>{rules.digest.enabled ? 'ON' : 'OFF'}</span>
              </li>
              {ruleList.map(([key, r]) => (
                <li key={key} className="flex items-center justify-between gap-3 py-2 text-[13px] border-t border-[#EEF0F3]">
                  <span className={r.enabled ? '' : 'text-[#5B6270]'}>{RULE_LABELS[key] ?? key}</span>
                  <span className={badge(r.enabled)}>{r.enabled ? 'ON' : 'OFF'}</span>
                </li>
              ))}
            </ul>

            <p className={sub}>
              届け先は環境変数（<code className={code}>DISCORD_WEBHOOK_URL</code> / <code className={code}>NTFY_TOPIC</code> /{' '}
              <code className={code}>LINE_CHANNEL_ACCESS_TOKEN</code>+<code className={code}>LINE_TO</code>）で設定。ルールは{' '}
              <code className={code}>data/notifications.json</code> を編集します。
            </p>

            <div className={`${divider} flex flex-wrap gap-2`}>
              <button type="button" className={btn} disabled={evalBusy !== null} onClick={() => callNotify(false, 'eval')}>
                {evalBusy === 'eval' ? '評価中…' : '今すぐ評価'}
              </button>
              <button type="button" className={btnPrimary} disabled={evalBusy !== null || channels.length === 0} onClick={() => callNotify(true, 'test')}>
                {evalBusy === 'test' ? '送信中…' : 'テスト送信'}
              </button>
            </div>

            {evalResult && (
              <div className={result} aria-live="polite">
                {evalResult.alerts.length === 0 ? 'アラートなし' : evalResult.alerts.map((a) => `${a.level === 'warn' ? '⚠' : 'ℹ'} ${a.text}`).join('\n')}
                {evalResult.sent.length > 0 &&
                  '\n\n送信結果:\n' +
                    evalResult.sent
                      .flatMap((s) => s.results.map((r) => `${s.kind} → ${r.channel}: ${r.ok ? 'OK' : `失敗 ${r.detail ?? ''}`}`))
                      .join('\n')}
              </div>
            )}
          </section>

          <section aria-label="ユーザーPush送信" className={`${CARD} p-4 md:p-5 flex flex-col gap-4 min-w-0`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <h2 className={h2}>
                  <span className={dot(pushApps.length > 0)} />
                  ユーザーPush送信
                </h2>
                <p className="text-xs text-[#5B6270]">バックエンドの POST /admin/push へ転送します</p>
              </div>
              <span className={badge(pushApps.length > 0)}>{pushApps.length > 0 ? `${pushApps.length}アプリ対応` : '未設定'}</span>
            </div>

            <div className="flex flex-col gap-3">
              <label className={label}>
                送信先
                <select value={app} onChange={(e) => setApp(e.target.value)} className={field}>
                  <option value="all">全アプリ（対応済みのみ）</option>
                  {pushApps.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                タイトル
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  placeholder="例：新機能のお知らせ"
                  className={field}
                />
              </label>
              <label className={label}>
                <span className="flex items-center justify-between">
                  本文
                  <span className="font-mono font-medium text-[11px] text-[#5B6270] tabular-nums">{body.length}/2000</span>
                </span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="例：○○機能を追加しました。ぜひ試してみてください。"
                  className={`${field} py-2.5 resize-y`}
                />
              </label>
            </div>

            <p className={sub}>
              対応アプリは <code className={code}>ADMIN_PUSH_ENDPOINTS</code> で設定。ユーザーの「アプリのお知らせ」設定をOFFにしている人には届きません。
            </p>

            <div className={`${divider} flex flex-wrap gap-2`}>
              <button type="button" className={btnPrimary} disabled={pushBusy || !title.trim() || !body.trim() || pushApps.length === 0} onClick={sendPush}>
                {pushBusy ? '送信中…' : '送信する'}
              </button>
            </div>

            {pushResult && (
              <div className={result} aria-live="polite">
                {'error' in pushResult
                  ? `エラー: ${pushResult.error}`
                  : pushResult.results.map((r) => (r.ok ? `${r.app}: ${r.targets}台へ送信（無効トークン ${r.invalidRemoved}件削除）` : `${r.app}: 失敗 ${r.error}`)).join('\n')}
              </div>
            )}
          </section>
        </div>

        <section aria-label="プロダクト別設定" className={`${CARD} pt-4 md:pt-5 pb-2 flex flex-col gap-3 min-w-0`}>
          <div className="flex flex-col gap-0.5 px-4 md:px-6">
            <h2 className="text-base font-bold">プロダクト別設定</h2>
            <p className="text-xs text-[#5B6270]">
              ON/OFF は <code className={code}>data/notifications.json</code> の <code className={code}>apps</code> セクションで変更します
            </p>
          </div>

          <div role="table" aria-label="プロダクト別の通知設定" className="text-[13px]">
            <div
              role="row"
              className="hidden md:grid grid-cols-[minmax(220px,1.6fr)_1fr_1fr_1fr_150px] items-center text-xs text-[#5B6270] border-b border-[#E3E6EB]"
            >
              <span role="columnheader" className="font-medium py-2.5 px-6">アプリ</span>
              <span role="columnheader" className="font-medium py-2.5 px-3">アラート</span>
              <span role="columnheader" className="font-medium py-2.5 px-3">日次サマリー</span>
              <span role="columnheader" className="font-medium py-2.5 px-3">ユーザーPush</span>
              <span role="columnheader" className="py-2.5 pl-3 pr-6">
                <span className="sr-only">操作</span>
              </span>
            </div>
            {apps.map((a, i) => {
              const cfg = rules.apps[a.name] ?? {}
              const alertsOn = cfg.alerts !== false
              const digestOn = cfg.digest !== false
              const canPush = pushApps.includes(a.name)
              const selected = canPush && app === a.name
              return (
                <div
                  key={a.name}
                  role="row"
                  className={`grid grid-cols-3 md:grid-cols-[minmax(220px,1.6fr)_1fr_1fr_1fr_150px] items-center gap-y-3 px-4 py-3.5 md:p-0 hover:bg-[#F8F9FB] ${
                    i < apps.length - 1 ? 'border-b border-[#EEF0F3]' : ''
                  }`}
                >
                  <div role="rowheader" className="col-span-3 md:col-span-1 flex items-center gap-3 md:py-3.5 md:px-6 min-w-0">
                    <span
                      className="w-9 h-9 shrink-0 rounded-[9px] bg-(--app-color) text-white flex items-center justify-center font-mono font-bold text-[15px]"
                      style={vars({ '--app-color': a.color })}
                      aria-hidden="true"
                    >
                      {a.name.slice(-1)}
                    </span>
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-bold truncate">{a.name}</span>
                      <span className="text-xs text-[#5B6270]">
                        {a.cat}
                        {a.deployed ? '' : ' ・ 未デプロイ'}
                      </span>
                    </span>
                  </div>
                  <div role="cell" className="flex flex-col items-start gap-1 md:py-3.5 md:px-3">
                    <span className="md:hidden text-[11px] text-[#5B6270]">アラート</span>
                    <span className={badge(alertsOn)}>{alertsOn ? 'ON' : 'OFF'}</span>
                  </div>
                  <div role="cell" className="flex flex-col items-start gap-1 md:py-3.5 md:px-3">
                    <span className="md:hidden text-[11px] text-[#5B6270]">日次サマリー</span>
                    <span className={badge(digestOn)}>{digestOn ? 'ON' : 'OFF'}</span>
                  </div>
                  <div role="cell" className="flex flex-col items-start gap-1 md:py-3.5 md:px-3">
                    <span className="md:hidden text-[11px] text-[#5B6270]">ユーザーPush</span>
                    <span className={badge(canPush)}>{canPush ? '送信可' : (a.pushKind && PUSH_LABEL[a.pushKind]) || '未対応'}</span>
                  </div>
                  <div role="cell" className={`${canPush ? 'col-span-3' : 'hidden'} md:block md:col-span-1 md:py-3.5 md:pl-3 md:pr-6`}>
                    {canPush && (
                      <button type="button" className={`${selected ? PILL_ON : btn} w-full md:w-auto`} aria-pressed={selected} onClick={() => setApp(a.name)}>
                        {selected ? '送信対象' : '送信対象に選択'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
