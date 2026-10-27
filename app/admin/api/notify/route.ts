import { getAdminRaw } from '../../lib/aggregate'
import { alertBody, evaluate, sendAll } from '../../lib/notify'

// 管理画面の通知設定ページからの手動評価・送信。
// {"send":true} で設定チャネルへ実送信、省略/Falseなら評価結果だけ返す。
// アクセス制御は proxy.ts の /admin/*（IP許可リスト + Basic認証）。
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { send?: boolean }
  const raw = await getAdminRaw()
  const ev = evaluate(raw)

  const sent: { kind: string; results: unknown }[] = []
  if (body.send === true) {
    const alerts = alertBody(ev)
    if (alerts) sent.push({ kind: 'alerts', results: await sendAll('[admin] アラート', alerts) })
    if (ev.digest) sent.push({ kind: 'digest', results: await sendAll('[admin] 日次サマリー', ev.digest) })
    if (sent.length === 0) sent.push({ kind: 'test', results: await sendAll('[admin] テスト通知', '通知は設定済みチャネルへ届いています。') })
  }

  return Response.json({ alerts: ev.alerts, digest: ev.digest, sent })
}
