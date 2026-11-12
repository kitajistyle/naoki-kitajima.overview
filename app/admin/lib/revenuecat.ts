import type { SourcePatch } from './types'

// Env: RC_API_KEY (v2 secret key), RC_PROJECT_ID ("proj..."),
// RC_APP_NAME (dashboard app name this project maps to, e.g. "Cypher Map").
// RevenueCat covers both stores for the app's IAP: proceeds (iap), new
// customers (dl proxy), and active customers (dau). All values are requested
// in JPY so no FX handling is needed.
// Requires permission: charts_metrics:charts:read (Charts & Metrics domain).
const BASE = 'https://api.revenuecat.com/v2'

interface ChartSeriesMeta {
  unit?: string
  display_name?: string
}

// values is a flat list of points: one per (cohort, measure). cohort is the
// period start in epoch seconds; measure indexes into measures.
interface ChartPoint {
  cohort: number
  measure: number
  value: number
}

interface ChartData {
  resolution?: string
  values?: ChartPoint[]
  measures?: ChartSeriesMeta[]
}

interface SeriesPoint {
  date: string
  value: number
}

const fetchChart = async (key: string, project: string, chart: string, params: Record<string, string>): Promise<ChartData | null> => {
  const url = `${BASE}/projects/${project}/charts/${chart}?` + new URLSearchParams({ currency: 'JPY', ...params })
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return (await res.json()) as ChartData
  } catch {
    return null
  }
}

// Returns one measure's points ordered by date. With moneyOnly the money
// measure is picked (the revenue chart also carries transaction and ad
// impression counts).
const series = (d: ChartData, moneyOnly: boolean): SeriesPoint[] => {
  let measure = 0
  if (moneyOnly) {
    const found = (d.measures ?? []).findIndex((m) => m.unit === '$' || m.unit === '¥' || (m.unit ?? '').includes('JPY'))
    if (found >= 0) measure = found
  }
  return (d.values ?? [])
    .filter((p) => p.measure === measure)
    .sort((a, b) => a.cohort - b.cohort)
    .map((p) => ({ date: new Date(p.cohort * 1000).toISOString().slice(0, 10), value: Number(p.value) || 0 }))
}

const sum = (xs: SeriesPoint[], from: number, to: number): number => xs.slice(from, to).reduce((a, p) => a + p.value, 0)

export async function fetchRevenueCatMetrics(): Promise<SourcePatch> {
  const key = process.env.RC_API_KEY
  const project = process.env.RC_PROJECT_ID
  const appName = process.env.RC_APP_NAME
  if (!key || !project || !appName) return { apps: {} }

  const end = new Date()
  const start = new Date(end.getTime() - 89 * 86400000)
  const iso = (d: Date) => d.toISOString().slice(0, 10)

  const [revenue, actives, customersNew] = await Promise.all([
    fetchChart(key, project, 'revenue', {
      start_date: iso(start),
      end_date: iso(end),
      selectors: JSON.stringify({ revenue_type: 'proceeds' }),
    }),
    fetchChart(key, project, 'customers_active', { start_date: iso(start), end_date: iso(end) }),
    fetchChart(key, project, 'customers_new', { start_date: iso(start), end_date: iso(end) }),
  ])

  if (!revenue && !actives && !customersNew) throw new Error('Charts API の呼び出しに失敗（API キー・プロジェクト ID を確認）')

  const patch: SourcePatch['apps'][string] = {}
  const apps: SourcePatch['apps'] = {}

  // When App Store Connect also covers this app, it is the record for
  // downloads and proceeds (and already feeds the daily chart); taking them
  // from RevenueCat too would override or double-count them.
  const ascApps = process.env.ASC_APP_IDS ? (JSON.parse(process.env.ASC_APP_IDS) as Record<string, string>) : {}
  const coveredByAsc = appName in ascApps

  // iap: last 30 daily proceeds; delta: vs previous 30 days.
  let daily: SourcePatch['daily']
  if (!coveredByAsc && revenue?.resolution === 'day') {
    const iapSeries = series(revenue, true)
    if (iapSeries.length >= 60) {
      const cur = sum(iapSeries, iapSeries.length - 30, iapSeries.length)
      const prev = sum(iapSeries, iapSeries.length - 60, iapSeries.length - 30)
      patch.iap = cur
      patch.delta = prev > 0 ? ((cur - prev) / prev) * 100 : 0
    } else if (iapSeries.length >= 30) {
      patch.iap = sum(iapSeries, iapSeries.length - 30, iapSeries.length)
    }
    if (iapSeries.length > 0) {
      daily = iapSeries.map((p) => ({ date: p.date, ad: 0, iap: p.value }))
    }
  }

  // dau: mean daily active customers over the last 30 reported days.
  if (actives) {
    const xs = series(actives, false)
    if (xs.length > 0) patch.dau = sum(xs, Math.max(0, xs.length - 30), xs.length) / Math.min(30, xs.length)
  }

  // dl: new customers over the last 30 days (approximation of installs),
  // matching the 30-day window the other sources report.
  if (!coveredByAsc && customersNew) {
    const xs = series(customersNew, false)
    if (xs.length > 0) patch.dl = Math.round(sum(xs, Math.max(0, xs.length - 30), xs.length))
  }

  if (Object.keys(patch).length > 0) apps[appName] = patch
  return { apps, daily }
}
