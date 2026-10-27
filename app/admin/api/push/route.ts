// ユーザー向けPush通知の fan-out。
// ADMIN_PUSH_ENDPOINTS = {"<app name>": "https://<backend>/admin/push?token=…"}
// POST {"app":"<name>"|null, "title":"…", "body":"…"} → 各バックエンドへ転送。
// app=null（または"all"）は設定済み全アプリへ送る。
// アクセス制御は proxy.ts の /admin/*（IP許可リスト + Basic認証）。
export async function POST(request: Request) {
  const raw = process.env.ADMIN_PUSH_ENDPOINTS
  if (!raw) return Response.json({ error: 'ADMIN_PUSH_ENDPOINTS 未設定' }, { status: 503 })

  let endpoints: Record<string, string>
  try {
    endpoints = JSON.parse(raw) as Record<string, string>
  } catch {
    return Response.json({ error: 'ADMIN_PUSH_ENDPOINTS が壊れたJSONです' }, { status: 500 })
  }

  const body = (await request.json().catch(() => null)) as { app?: string; title?: string; body?: string } | null
  if (!body?.title || !body.body) {
    return Response.json({ error: 'title と body は必須です' }, { status: 400 })
  }

  const targets = Object.entries(endpoints).filter(([name]) => !body.app || body.app === 'all' || name === body.app)
  if (targets.length === 0) {
    return Response.json({ error: '送信対象のアプリがありません' }, { status: 404 })
  }

  const results = await Promise.all(
    targets.map(async ([name, url]) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: body.title, body: body.body }),
          signal: AbortSignal.timeout(15000),
          cache: 'no-store',
        })
        const data = (await res.json().catch(() => ({}))) as { targets?: number; invalidRemoved?: number }
        return res.ok
          ? { app: name, ok: true, targets: data.targets ?? 0, invalidRemoved: data.invalidRemoved ?? 0 }
          : { app: name, ok: false, error: `HTTP ${res.status}` }
      } catch {
        return { app: name, ok: false, error: '接続失敗' }
      }
    })
  )
  return Response.json({ results })
}
