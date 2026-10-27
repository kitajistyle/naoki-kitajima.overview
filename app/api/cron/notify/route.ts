import { getAdminRaw } from '../../../admin/lib/aggregate'
import { alertBody, evaluate, sendAll } from '../../../admin/lib/notify'

// Vercel Cron: vercel.json の crons で1日1回呼ばれる。
// CRON_SECRET が未設定なら常に404 — 設定漏れで外部に開くより動かない方が安全。
// Vercel は cron 実行時に Authorization: Bearer <CRON_SECRET> を付けてくる。
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Not found', { status: 404 })
  }

  const raw = await getAdminRaw()
  const ev = evaluate(raw)
  const sent: { kind: string; results: unknown }[] = []

  const alerts = alertBody(ev)
  if (alerts) {
    sent.push({ kind: 'alerts', results: await sendAll('[admin] アラート', alerts) })
  }
  if (ev.digest) {
    sent.push({ kind: 'digest', results: await sendAll('[admin] 日次サマリー', ev.digest) })
  }

  return Response.json({ alerts: ev.alerts, digest: ev.digest !== null, sent })
}
