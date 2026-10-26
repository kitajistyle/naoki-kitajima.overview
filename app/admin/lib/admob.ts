import type { SourcePatch } from './types'

// Env: ADMOB_CLIENT_ID, ADMOB_CLIENT_SECRET, ADMOB_REFRESH_TOKEN,
// ADMOB_PUBLISHER_ID (pub-xxxxxxxxxxxxxxxx),
// ADMOB_APP_IDS as JSON {"<app name>": "<admob app id ca-app-pub-...~...>"}.
// Note: the AdMob API requires user OAuth (refresh token); service accounts
// are not supported.
const accessToken = async (): Promise<string | null> => {
  const { ADMOB_CLIENT_ID: id, ADMOB_CLIENT_SECRET: secret, ADMOB_REFRESH_TOKEN: refresh } = process.env
  if (!id || !secret || !refresh) return null
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: id,
      client_secret: secret,
      refresh_token: refresh,
      grant_type: 'refresh_token',
    }),
    next: { revalidate: 1800 },
  })
  if (!res.ok) return null
  const json = (await res.json()) as { access_token?: string }
  return json.access_token ?? null
}

const ymd = (d: Date) => ({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() })

export async function fetchAdmobMetrics(): Promise<SourcePatch> {
  const token = await accessToken()
  const publisher = process.env.ADMOB_PUBLISHER_ID
  const appIds = process.env.ADMOB_APP_IDS ? (JSON.parse(process.env.ADMOB_APP_IDS) as Record<string, string>) : null
  if (!token || !publisher || !appIds) return { apps: {} }

  const end = new Date()
  const start = new Date(end.getTime() - 89 * 86400000)
  const res = await fetch(`https://admob.googleapis.com/v1/accounts/${publisher}/networkReport:generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      reportSpec: {
        dateRange: { startDate: ymd(start), endDate: ymd(end) },
        dimensions: ['APP', 'DATE'],
        metrics: ['ESTIMATED_EARNINGS'],
        dimensionFilters: [{ dimension: 'APP', matchesAnyOf: { values: Object.values(appIds) } }],
      },
    }),
    next: { revalidate: 3600 },
  })
  if (!res.ok) return { apps: {} }

  // Response is a stream of newline-delimited JSON rows.
  const byName = new Map(Object.entries(appIds).map(([name, id]) => [id, name]))
  const apps: SourcePatch['apps'] = {}
  const dailyMap = new Map<string, number>()
  for (const line of (await res.text()).split('\n')) {
    if (!line.trim()) continue
    try {
      const row = JSON.parse(line) as {
        row?: {
          dimensionValues?: {
            APP?: { value?: string }
            DATE?: { value?: string }
          }
          metricValues?: { ESTIMATED_EARNINGS?: { microsValue?: string } }
        }
      }
      const appId = row.row?.dimensionValues?.APP?.value
      const date = row.row?.dimensionValues?.DATE?.value
      const micros = row.row?.metricValues?.ESTIMATED_EARNINGS?.microsValue
      if (micros === undefined) continue
      const yen = Number(micros) / 1e6 // assumes currency JPY; AdMob reports in account currency
      const appName = appId ? byName.get(appId) : undefined
      if (appName) apps[appName] = { ...apps[appName], ad: (apps[appName]?.ad ?? 0) + yen }
      // AdMob DATE dimension comes back as "YYYYMMDD"
      if (date && date.length === 8) {
        const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        dailyMap.set(iso, (dailyMap.get(iso) ?? 0) + yen)
      }
    } catch {
      // skip partial/footer lines
    }
  }
  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, ad]) => ({ date, ad, iap: 0 }))
  return { apps, daily: daily.length > 0 ? daily : undefined }
}
