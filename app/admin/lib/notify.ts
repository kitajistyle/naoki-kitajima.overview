import type { AdminRaw } from './types'
import config from '../../../data/notifications.json'

// 管理者通知: 評価ルールは data/notifications.json、届け先は環境変数。
// どれも未設定なら何も送らない（sendAll は空配列を返す）。
//
//   DISCORD_WEBHOOK_URL          … Discord #channel の Webhook
//   NTFY_TOPIC (+ NTFY_SERVER)   … ntfy（既定 https://ntfy.sh）
//   LINE_CHANNEL_ACCESS_TOKEN    … Messaging API のチャネルトークン
//   LINE_TO                      … 送信先の userId / groupId
//
// 通知の発火は Vercel Cron（/api/cron/notify、1日1回）か
// /admin/notifications の「今すぐ評価」ボタン。

export interface ChannelResult {
  channel: string
  ok: boolean
  detail?: string
}

const post = async (url: string, init: RequestInit): Promise<string | undefined> => {
  const res = await fetch(url, { ...init, cache: 'no-store' })
  if (res.ok) return undefined
  return `HTTP ${res.status}`
}

const sendDiscord = (title: string, body: string) =>
  post(process.env.DISCORD_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: `**${title}**\n${body}` }),
  })

const sendNtfy = (title: string, body: string) =>
  post(`${process.env.NTFY_SERVER ?? 'https://ntfy.sh'}/${process.env.NTFY_TOPIC}`, {
    method: 'POST',
    headers: { Title: title, 'Content-Type': 'text/plain; charset=utf-8' },
    body,
  })

const sendLine = (title: string, body: string) =>
  post('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: process.env.LINE_TO,
      messages: [{ type: 'text', text: `${title}\n${body}` }],
    }),
  })

export function configuredChannels(): string[] {
  const out: string[] = []
  if (process.env.DISCORD_WEBHOOK_URL) out.push('Discord')
  if (process.env.NTFY_TOPIC) out.push('ntfy')
  if (process.env.LINE_CHANNEL_ACCESS_TOKEN && process.env.LINE_TO) out.push('LINE')
  return out
}

export async function sendAll(title: string, body: string): Promise<ChannelResult[]> {
  const jobs: { channel: string; send: () => Promise<string | undefined> }[] = []
  if (process.env.DISCORD_WEBHOOK_URL) jobs.push({ channel: 'Discord', send: () => sendDiscord(title, body) })
  if (process.env.NTFY_TOPIC) jobs.push({ channel: 'ntfy', send: () => sendNtfy(title, body) })
  if (process.env.LINE_CHANNEL_ACCESS_TOKEN && process.env.LINE_TO) jobs.push({ channel: 'LINE', send: () => sendLine(title, body) })
  return Promise.all(
    jobs.map(async (j) => {
      try {
        const err = await j.send()
        return { channel: j.channel, ok: err === undefined, detail: err }
      } catch (e) {
        return { channel: j.channel, ok: false, detail: e instanceof Error ? e.message : 'send failed' }
      }
    })
  )
}

export interface Alert {
  level: 'warn' | 'info'
  text: string
}

export interface NotifyEvaluation {
  alerts: Alert[]
  digest: string | null
}

const yen = (n: number) => '¥' + Math.round(n).toLocaleString('ja-JP')
const num = (n: number) => Math.round(n).toLocaleString('ja-JP')

// raw を data/notifications.json のルールで評価する。
export function evaluate(raw: AdminRaw): NotifyEvaluation {
  const alerts: Alert[] = []
  const rules = config.alerts

  if (rules.endpointDown.enabled) {
    for (const e of raw.errors ?? []) {
      alerts.push({ level: 'warn', text: `取得失敗: ${e}` })
    }
  }

  if (rules.revDropPct.enabled && raw.daily && raw.daily.length > 0) {
    const end = new Date(raw.daily[raw.daily.length - 1].date + 'T00:00:00').getTime()
    const sumIn = (from: number, to: number) =>
      raw.daily!.reduce((s, p) => {
        const t = new Date(p.date + 'T00:00:00').getTime()
        return t > end - to * 86400000 && t <= end - from * 86400000 ? s + p.ad + p.iap : s
      }, 0)
    const cur = sumIn(0, 30)
    const prev = sumIn(30, 60)
    if (prev > 0) {
      const drop = ((prev - cur) / prev) * 100
      if (drop >= rules.revDropPct.threshold) {
        alerts.push({ level: 'warn', text: `収益が前期間比 ${drop.toFixed(0)}% 低下（${yen(prev)} → ${yen(cur)}）` })
      }
    }
  }

  for (const a of raw.apps) {
    if (!a.deployed) continue
    // backend が繋がっている（users がある）のに DAU が閾値未満 = 実質ダウンの兆候
    if (rules.dauBelow.enabled && a.churn && a.churn.users > 0 && a.dau < rules.dauBelow.threshold) {
      alerts.push({ level: 'warn', text: `${a.name}: 平均DAU ${a.dau}（登録ユーザー ${num(a.churn.users)}）` })
    }
    if (rules.metricsMissing.enabled && a.dl === 0 && a.dau === 0 && a.ad === 0 && a.iap === 0 && !a.churn) {
      alerts.push({ level: 'info', text: `${a.name}: 指標を取得できていません（接続設定を確認）` })
    }
  }

  const digest = config.digest.enabled
    ? [
        `収益合計 ${yen(raw.apps.reduce((s, a) => s + a.ad + a.iap, 0))} / DAU合計 ${num(raw.apps.reduce((s, a) => s + a.dau, 0))} / DL合計 ${num(raw.apps.reduce((s, a) => s + a.dl, 0))}`,
        ...raw.apps
          .filter((a) => a.deployed)
          .map((a) => `${a.name}: DAU ${num(a.dau)} / 収益 ${yen(a.ad + a.iap)}`),
      ].join('\n')
    : null

  return { alerts, digest }
}

export function alertBody(ev: NotifyEvaluation): string | null {
  if (ev.alerts.length === 0) return null
  return ev.alerts.map((a) => `${a.level === 'warn' ? '⚠️' : 'ℹ️'} ${a.text}`).join('\n')
}
