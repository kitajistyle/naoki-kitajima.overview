import { createSign } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import type { SourcePatch } from './types'

const b64u = (s: string) => Buffer.from(s).toString('base64url')

// Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY (.p8 contents),
// ASC_VENDOR_NUMBER, ASC_APP_IDS as JSON {"<app name>": "<apple app id>"}.
// Fetches DAILY sales reports for the last ~90 days -> per-app downloads and
// JPY proceeds for the last 30 days, delta vs the 30 days before, and the
// daily iap series for the revenue chart. Non-JPY proceeds are skipped.
const jwt = (): string | null => {
  const { ASC_KEY_ID: kid, ASC_ISSUER_ID: iss, ASC_PRIVATE_KEY: key } = process.env
  if (!kid || !iss || !key) return null
  const now = Math.floor(Date.now() / 1000)
  const signingInput = [
    b64u(JSON.stringify({ alg: 'ES256', kid, typ: 'JWT' })),
    b64u(JSON.stringify({ iss, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' })),
  ].join('.')
  // JWS の ES256 は IEEE-P1363（r||s 連結）形式必須。Node のデフォルトは DER で
  // そのまま署名すると Apple が 401 を返す（実レスポンスで検証済み）。
  const signature = createSign('SHA256').update(signingInput).sign({ key, dsaEncoding: 'ieee-p1363' }, 'base64url')
  return `${signingInput}.${signature}`
}

const dayStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const fetchReport = async (token: string, vendor: string, frequency: 'DAILY', reportDate: string) => {
  const url =
    'https://api.appstoreconnect.apple.com/v1/salesReports?' +
    new URLSearchParams({
      'filter[vendorNumber]': vendor,
      'filter[reportType]': 'SALES',
      'filter[reportSubType]': 'SUMMARY',
      'filter[frequency]': frequency,
      'filter[reportDate]': reportDate,
    })
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  })
  // 404 = no report for that date (normal). Auth errors mean the config is wrong.
  if (res.status === 401 || res.status === 403) throw new Error(`認証エラー（HTTP ${res.status}）`)
  // null = report not available; '' or rows = fetched (no rows means 0 sales)
  if (!res.ok) return null
  return gunzipSync(await res.arrayBuffer()).toString('utf8')
}

interface SalesRow {
  appleId: string
  units: number
  proceeds: number
  currency: string
  productType: string
}

const parseTsv = (tsv: string): SalesRow[] => {
  const lines = tsv.trim().split('\n')
  if (lines.length < 2) return []
  const header = lines[0].split('\t')
  const col = (name: string) => header.indexOf(name)
  const [cAppleId, cUnits, cProceeds, cCurrency, cProductType] = [
    col('Apple Identifier'),
    col('Units'),
    col('Developer Proceeds'),
    col('Customer Currency'),
    col('Product Type Identifier'),
  ]
  return lines.slice(1).map((line) => {
    const f = line.split('\t')
    return {
      appleId: f[cAppleId] ?? '',
      units: Number(f[cUnits]) || 0,
      proceeds: Number(f[cProceeds]) || 0,
      currency: f[cCurrency] ?? '',
      productType: f[cProductType] ?? '',
    }
  })
}

const totalsByApp = (rows: SalesRow[], appIds: Record<string, string>) => {
  const byName = new Map(Object.entries(appIds).map(([name, id]) => [id, name]))
  const out: Record<string, { dl: number; iap: number }> = {}
  for (const r of rows) {
    const name = byName.get(r.appleId)
    if (!name) continue
    const entry = (out[name] ??= { dl: 0, iap: 0 })
    if (r.productType.startsWith('1')) entry.dl += r.units
    if (r.currency === 'JPY') entry.iap += r.proceeds
  }
  return out
}

export async function fetchAppStoreMetrics(): Promise<SourcePatch> {
  const token = jwt()
  const vendor = process.env.ASC_VENDOR_NUMBER
  const appIds = process.env.ASC_APP_IDS ? (JSON.parse(process.env.ASC_APP_IDS) as Record<string, string>) : null
  if (!token || !vendor || !appIds) return { apps: {} }

  // One sales report per day, 6 at a time. Reports lag ~1-2 days so start
  // from yesterday. Monthly reports only exist after the month closes, so the
  // per-app 30-day totals are summed from the daily reports too.
  const now = new Date()
  const days = [...Array(90)].map((_, i) => new Date(now.getTime() - (i + 1) * 86400000))
  const perDay: { date: string; totals: Record<string, { dl: number; iap: number }> | null }[] = []
  const CONCURRENCY = 6
  for (let i = 0; i < days.length; i += CONCURRENCY) {
    const batch = await Promise.all(
      days.slice(i, i + CONCURRENCY).map(async (d) => {
        const tsv = await fetchReport(token, vendor, 'DAILY', dayStr(d))
        return { date: dayStr(d), totals: tsv === null ? null : totalsByApp(parseTsv(tsv), appIds) }
      })
    )
    perDay.push(...batch)
  }

  // perDay is newest first. Days without a report (404 = no sales) count as 0.
  const windowTotals = (from: number, to: number) => {
    const out: Record<string, { dl: number; iap: number }> = {}
    for (const { totals } of perDay.slice(from, to)) {
      for (const [name, t] of Object.entries(totals ?? {})) {
        const e = (out[name] ??= { dl: 0, iap: 0 })
        e.dl += t.dl
        e.iap += t.iap
      }
    }
    return out
  }
  const cur = windowTotals(0, 30)
  const prev = windowTotals(30, 60)

  const apps: SourcePatch['apps'] = {}
  if (perDay.some((d) => d.totals !== null)) {
    for (const name of Object.keys(appIds)) {
      const c = cur[name] ?? { dl: 0, iap: 0 }
      const p = prev[name]
      const total = c.dl + c.iap
      const prevTotal = (p?.dl ?? 0) + (p?.iap ?? 0)
      apps[name] = { dl: c.dl, iap: c.iap, ...(prevTotal > 0 ? { delta: ((total - prevTotal) / prevTotal) * 100 } : {}) }
    }
  }

  const daily = perDay
    .filter((d) => d.totals !== null)
    .map(({ date, totals }) => ({ date, ad: 0, iap: Object.values(totals ?? {}).reduce((s, t) => s + t.iap, 0) }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return { apps, daily: daily.length > 0 ? daily : undefined }
}
