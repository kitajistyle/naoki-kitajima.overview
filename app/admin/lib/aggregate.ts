import type { AdminRaw, SourcePatch } from './types'
import { sampleRaw } from './sample'
import { fetchAppStoreMetrics } from './appstore'
import { fetchAdmobMetrics } from './admob'
import { fetchPlayMetrics } from './play'
import { fetchDbStats } from './dbstats'
import { fetchRevenueCatMetrics } from './revenuecat'

// Fetches all configured sources in parallel and merges their results over
// the sample data. Any source that is unconfigured or fails simply leaves the
// sample values for the fields it would have provided.
export async function getAdminRaw(): Promise<AdminRaw> {
  const raw = sampleRaw()
  const sources = [fetchAppStoreMetrics, fetchAdmobMetrics, fetchPlayMetrics, fetchDbStats, fetchRevenueCatMetrics]
  const results = await Promise.allSettled(sources.map((s) => s()))

  const merged: Record<string, SourcePatch['apps'][string]> = {}
  const dailyMap = new Map<string, { ad: number; iap: number }>()
  for (const r of results) {
    if (r.status !== 'fulfilled') continue
    for (const [name, patch] of Object.entries(r.value.apps)) {
      merged[name] = { ...merged[name], ...patch }
    }
    for (const p of r.value.daily ?? []) {
      const e = dailyMap.get(p.date) ?? { ad: 0, iap: 0 }
      e.ad += p.ad
      e.iap += p.iap
      dailyMap.set(p.date, e)
    }
  }

  raw.apps = raw.apps.map((a) => ({ ...a, ...(merged[a.name] ?? {}) }))
  if (dailyMap.size > 0) {
    raw.daily = [...dailyMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({ date, ...v }))
  }
  return raw
}
