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

interface ChartData {
  resolution?: string
  start_date?: number | string
  values?: unknown[][]
  measures?: ChartSeriesMeta[]
}

const num = (v: unknown): number => {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && 'value' in v) return Number((v as { value: unknown }).value) || 0
  return 0
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

// values[i] is a series; measures[i] describes it. Pick the money series when
// several exist (revenue chart also carries a transaction-count series).
const series = (d: ChartData, moneyOnly: boolean): number[] => {
  const rows = d.values ?? []
  let i = 0
  if (moneyOnly) {
    const found = (d.measures ?? []).findIndex((m) => m.unit === '$' || m.unit === '¥' || (m.unit ?? '').includes('JPY'))
    if (found >= 0) i = found
  }
  return (rows[i] ?? []).map(num)
}

// Chart data points are one value per period starting at start_date; for
// resolution="day" index i maps to start_date + i days. start_date is epoch
// (seconds or milliseconds) or an ISO string depending on the chart version.
const seriesStartMs = (d: ChartData): number => {
  const s = d.start_date
  if (typeof s === 'number') return s < 1e12 ? s * 1000 : s
  if (typeof s === 'string') return Date.parse(s)
  return NaN
}

const sum = (xs: number[], from: number, to: number): number => xs.slice(from, to).reduce((a, b) => a + b, 0)

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
    // All-time new customers ≈ cumulative installs; summing works at any resolution.
    fetchChart(key, project, 'customers_new', { start_date: '2020-01-01', end_date: iso(end) }),
  ])

  const patch: SourcePatch['apps'][string] = {}
  const apps: SourcePatch['apps'] = {}

  // iap: last 30 daily proceeds; delta: vs previous 30 days.
  let daily: SourcePatch['daily']
  if (revenue?.resolution === 'day') {
    const iapSeries = series(revenue, true)
    if (iapSeries.length >= 60) {
      const cur = sum(iapSeries, iapSeries.length - 30, iapSeries.length)
      const prev = sum(iapSeries, iapSeries.length - 60, iapSeries.length - 30)
      patch.iap = cur
      patch.delta = prev > 0 ? ((cur - prev) / prev) * 100 : 0
    } else if (iapSeries.length >= 30) {
      patch.iap = sum(iapSeries, iapSeries.length - 30, iapSeries.length)
    }
    const startMs = seriesStartMs(revenue)
    if (!Number.isNaN(startMs) && iapSeries.length > 0) {
      daily = iapSeries.map((iap, i) => ({
        date: new Date(startMs + i * 86400000).toISOString().slice(0, 10),
        ad: 0,
        iap,
      }))
    }
  }

  // dau: mean daily active customers over the last 30 reported days.
  if (actives) {
    const xs = series(actives, false)
    if (xs.length > 0) patch.dau = sum(xs, Math.max(0, xs.length - 30), xs.length) / Math.min(30, xs.length)
  }

  // dl: all-time new customers (approximation of cumulative installs).
  if (customersNew) {
    const xs = series(customersNew, false)
    if (xs.length > 0) patch.dl = Math.round(sum(xs, 0, xs.length))
  }

  if (Object.keys(patch).length > 0) apps[appName] = patch
  return { apps, daily }
}
