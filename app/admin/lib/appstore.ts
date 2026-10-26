import { createSign } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import type { SourcePatch } from './types'

const b64u = (s: string) => Buffer.from(s).toString('base64url')

// Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY (.p8 contents),
// ASC_VENDOR_NUMBER, ASC_APP_IDS as JSON {"<app name>": "<apple app id>"}.
// Fetches sales reports: MONTHLY (this + previous month -> downloads, JPY
// proceeds, delta) and DAILY for the last ~90 days -> daily iap series for the
// revenue chart. Non-JPY proceeds are skipped.
const jwt = (): string | null => {
  const { ASC_KEY_ID: kid, ASC_ISSUER_ID: iss, ASC_PRIVATE_KEY: key } = process.env
  if (!kid || !iss || !key) return null
  const now = Math.floor(Date.now() / 1000)
  const signingInput = [
    b64u(JSON.stringify({ alg: 'ES256', kid, typ: 'JWT' })),
    b64u(JSON.stringify({ iss, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' })),
  ].join('.')
  const signature = createSign('SHA256').update(signingInput).sign(key, 'base64url')
  return `${signingInput}.${signature}`
}

const monthStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const dayStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const fetchReport = async (token: string, vendor: string, frequency: 'DAILY' | 'MONTHLY', reportDate: string) => {
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
  if (!res.ok) return ''
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

  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const [curTsv, prevTsv] = await Promise.all([
    fetchReport(token, vendor, 'MONTHLY', monthStr(now)),
    fetchReport(token, vendor, 'MONTHLY', monthStr(prev)),
  ])

  const cur = totalsByApp(parseTsv(curTsv), appIds)
  const prevM = totalsByApp(parseTsv(prevTsv), appIds)
  const apps: SourcePatch['apps'] = {}
  for (const name of Object.keys(appIds)) {
    const c = cur[name]
    if (!c) continue
    const p = prevM[name]
    const total = c.dl + c.iap
    const prevTotal = (p?.dl ?? 0) + (p?.iap ?? 0)
    apps[name] = { dl: c.dl, iap: c.iap, delta: prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0 }
  }

  // Daily iap series for the chart: one sales report per day, 6 at a time.
  // Reports lag ~1-2 days so start from yesterday; missing days are skipped.
  const dailyMap = new Map<string, number>()
  const days = [...Array(90)].map((_, i) => new Date(now.getTime() - (i + 1) * 86400000))
  const CONCURRENCY = 6
  for (let i = 0; i < days.length; i += CONCURRENCY) {
    const batch = await Promise.all(
      days.slice(i, i + CONCURRENCY).map(async (d) => ({
        date: dayStr(d),
        tsv: await fetchReport(token, vendor, 'DAILY', dayStr(d)),
      }))
    )
    for (const { date, tsv } of batch) {
      if (!tsv) continue
      const totals = totalsByApp(parseTsv(tsv), appIds)
      const iap = Object.values(totals).reduce((s, t) => s + t.iap, 0)
      dailyMap.set(date, iap)
    }
  }
  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, iap]) => ({ date, ad: 0, iap }))

  return { apps, daily: daily.length > 0 ? daily : undefined }
}
