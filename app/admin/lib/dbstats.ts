import type { ChurnStats, SourcePatch } from './types'

// Env: ADMIN_STATS_ENDPOINTS as JSON {"<app name>": "https://<backend>/path"}.
// Each app backend exposes a GET endpoint returning JSON:
//   {
//     "dau": 1480,                       // avg daily active users (30d)
//     "users": 5023,                     // push_tokens total (excl. testers)
//     "lastSeenBuckets": [0.46,0.22,0.14,0.18], // fractions: <=7d/8-30d/31-60d/61d+
//     "churnRate": 0.32                  // optional; derived from buckets if absent
//   }
// Backends should return 200 JSON within a few seconds; failures keep sample data.
interface StatsResponse {
  dau?: number
  users?: number
  lastSeenBuckets?: number[]
  churnRate?: number
}

export async function fetchDbStats(): Promise<SourcePatch> {
  const raw = process.env.ADMIN_STATS_ENDPOINTS
  if (!raw) return { apps: {} }
  let endpoints: Record<string, string>
  try {
    endpoints = JSON.parse(raw) as Record<string, string>
  } catch {
    return { apps: {} }
  }

  const apps: SourcePatch['apps'] = {}
  await Promise.all(
    Object.entries(endpoints).map(async ([name, url]) => {
      try {
        const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) })
        if (!res.ok) return
        const data = (await res.json()) as StatsResponse
        const patch: SourcePatch['apps'][string] = {}
        if (typeof data.dau === 'number') patch.dau = data.dau
        if (typeof data.users === 'number' && Array.isArray(data.lastSeenBuckets) && data.lastSeenBuckets.length === 4) {
          const churn: ChurnStats = {
            users: data.users,
            fractions: data.lastSeenBuckets as ChurnStats['fractions'],
          }
          patch.churn = churn
        }
        if (Object.keys(patch).length > 0) apps[name] = patch
      } catch {
        // endpoint down -> keep sample fallback for this app
      }
    })
  )
  return { apps }
}
