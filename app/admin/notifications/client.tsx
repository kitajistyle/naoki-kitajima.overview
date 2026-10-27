'use client'

import Link from 'next/link'
import { useState } from 'react'

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

const card = 'bg-white border border-[#E3E6EB] rounded-2xl p-5 flex flex-col gap-4'
const h2 = 'text-base font-bold'
const sub = 'text-xs text-[#5B6270] leading-[1.6]'
const btn =
  'min-h-9 px-4 rounded-full text-xs font-bold cursor-pointer border border-[#D5D9E0] bg-white text-[#464C57] hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed'
const btnPrimary =
  'min-h-9 px-4 rounded-full text-xs font-bold cursor-pointer bg-[#14161A] text-white hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed'
const badge = (on: boolean) =>
  `text-[10px] font-bold px-[7px] py-0.5 rounded-full ${on ? 'bg-[#E3F5EC] text-[#0B6B4B]' : 'bg-[#E6E9EE] text-[#5B6270]'}`

export function NotificationsClient({
  channels,
  rules,
  pushApps,
  apps,
}: {
  channels: string[]
  rules: { digest: { enabled: boolean }; alerts: Record<string, AlertRule> }
  pushApps: string[]
  apps: { name: string; deployed: boolean }[]
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

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#14161A] font-sans">
      <div className="max-w-[920px] mx-auto px-5 py-8 flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[26px] font-bold tracking-[0.01em]">通知設定</h1>
            <p className="text-[13px] text-[#5B6270]">管理者アラートとユーザー向けPush送信</p>
          </div>
          <Link href="/admin" className={btn}>
            ← 概要に戻る
          </Link>
        </header>

        <section className={card} aria-label="管理者アラート">
          <div className="flex items-center justify-between">
            <h2 className={h2}>管理者アラート</h2>
            <span className={badge(channels.length > 0)}>{channels.length > 0 ? '有効' : 'チャネル未設定'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CHANNELS.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-xs text-[#464C57] border border-[#E3E6EB] rounded-full px-3 py-1.5">
                {c}
                <span className={badge(channels.includes(c))}>{channels.includes(c) ? '設定済み' : '未設定'}</span>
              </span>
            ))}
          </div>
          <p className={sub}>
            届け先は環境変数（DISCORD_WEBHOOK_URL / NTFY_TOPIC / LINE_CHANNEL_ACCESS_TOKEN+LINE_TO）で設定。
            ルールは <code className="font-mono text-[11px] bg-[#F4F5F7] px-1 rounded">data/notifications.json</code> を編集。
            Vercel Cron で毎朝（JST 8:00）評価します。
          </p>

          <div className="flex flex-col gap-2 border-t border-[#EEF0F3] pt-4">
            <div className="flex items-center justify-between text-sm">
              <span>日次サマリー（収益・DAU・DL）</span>
              <span className={badge(rules.digest.enabled)}>{rules.digest.enabled ? 'ON' : 'OFF'}</span>
            </div>
            {Object.entries(rules.alerts).map(([key, r]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span>{RULE_LABELS[key] ?? key}</span>
                <span className={badge(r.enabled)}>{r.enabled ? 'ON' : 'OFF'}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-[#EEF0F3] pt-4">
            <button type="button" className={btn} disabled={evalBusy !== null} onClick={() => callNotify(false, 'eval')}>
              {evalBusy === 'eval' ? '評価中…' : '今すぐ評価'}
            </button>
            <button type="button" className={btnPrimary} disabled={evalBusy !== null || channels.length === 0} onClick={() => callNotify(true, 'test')}>
              {evalBusy === 'test' ? '送信中…' : 'テスト送信'}
            </button>
          </div>

          {evalResult && (
            <div className="bg-[#F4F5F7] rounded-lg p-3 text-xs leading-[1.7] font-mono whitespace-pre-wrap">
              {evalResult.alerts.length === 0 ? 'アラートなし' : evalResult.alerts.map((a) => `${a.level === 'warn' ? '⚠' : 'ℹ'} ${a.text}`).join('\n')}
              {evalResult.sent.length > 0 &&
                '\n\n送信結果:\n' +
                  evalResult.sent
                    .flatMap((s) => s.results.map((r) => `${s.kind} → ${r.channel}: ${r.ok ? 'OK' : `失敗 ${r.detail ?? ''}`}`))
                    .join('\n')}
            </div>
          )}
        </section>

        <section className={card} aria-label="ユーザーPush送信">
          <div className="flex items-center justify-between">
            <h2 className={h2}>ユーザーPush送信</h2>
            <span className={badge(pushApps.length > 0)}>{pushApps.length > 0 ? `${pushApps.length}アプリ対応` : '未設定'}</span>
          </div>
          <p className={sub}>
            バックエンドの POST /admin/push へ転送します。対応アプリは ADMIN_PUSH_ENDPOINTS で設定。
            ユーザーの「アプリのお知らせ」設定をOFFにしている人には届きません。
          </p>
          <div className="flex flex-wrap gap-1.5">
            {apps.map((a) => (
              <span key={a.name} className={`text-xs rounded-full px-3 py-1.5 border ${pushApps.includes(a.name) ? 'border-[#D5D9E0] text-[#464C57]' : 'border-[#E3E6EB] text-[#9AA4B2]'}`}>
                {a.name}
                {pushApps.includes(a.name) ? '' : '（未対応）'}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#EEF0F3] pt-4">
            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#464C57]">
              送信先
              <select value={app} onChange={(e) => setApp(e.target.value)} className="min-h-10 rounded-lg border border-[#D5D9E0] bg-white px-3 text-sm font-normal">
                <option value="all">全アプリ（対応済みのみ）</option>
                {pushApps.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#464C57]">
              タイトル
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                placeholder="例：新機能のお知らせ"
                className="min-h-10 rounded-lg border border-[#D5D9E0] px-3 text-sm font-normal placeholder:text-[#9AA4B2]"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#464C57]">
              本文
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="例：○○機能を追加しました。ぜひ試してみてください。"
                className="rounded-lg border border-[#D5D9E0] px-3 py-2.5 text-sm font-normal placeholder:text-[#9AA4B2] resize-y"
              />
            </label>
            <div className="flex items-center gap-3">
              <button type="button" className={btnPrimary} disabled={pushBusy || !title.trim() || !body.trim() || pushApps.length === 0} onClick={sendPush}>
                {pushBusy ? '送信中…' : '送信する'}
              </button>
              <span className={sub}>{body.length}/2000</span>
            </div>
          </div>

          {pushResult && (
            <div className="bg-[#F4F5F7] rounded-lg p-3 text-xs leading-[1.7] font-mono whitespace-pre-wrap">
              {'error' in pushResult
                ? `エラー: ${pushResult.error}`
                : pushResult.results.map((r) => (r.ok ? `${r.app}: ${r.targets}台へ送信（無効トークン ${r.invalidRemoved}件削除）` : `${r.app}: 失敗 ${r.error}`)).join('\n')}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
