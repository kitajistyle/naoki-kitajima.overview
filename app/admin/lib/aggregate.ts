import type { AdminRaw, SourcePatch } from './types'
import { baseRaw } from './base'
import { fetchAppStoreMetrics } from './appstore'
import { fetchAdmobMetrics } from './admob'
import { fetchPlayMetrics } from './play'
import { fetchDbStats } from './dbstats'
import { fetchRevenueCatMetrics } from './revenuecat'

// Fetches all configured sources in parallel and merges their results over the
// app registry. Fields a source doesn't provide stay 0/undefined (shown as —).
export async function getAdminRaw(): Promise<AdminRaw> {
  const raw = baseRaw()
  const sources = [fetchAppStoreMetrics, fetchAdmobMetrics, fetchPlayMetrics, fetchDbStats, fetchRevenueCatMetrics]
  const results = await Promise.allSettled(sources.map((s) => s()))

  const merged: Record<string, SourcePatch['apps'][string]> = {}
  const dailyMap = new Map<string, { ad: number; iap: number }>()
  const errors: string[] = []
  const names = ['AppStoreConnect', 'AdMob', 'GooglePlay', 'DbStats', 'RevenueCat']
  results.forEach((r, i) => {
    if (r.status !== 'fulfilled') {
      errors.push(`${names[i]}: ${r.reason instanceof Error ? r.reason.message : 'failed'}`)
      return
    }
    errors.push(...(r.value.errors ?? []))
    for (const [name, patch] of Object.entries(r.value.apps)) {
      merged[name] = { ...merged[name], ...patch }
    }
    for (const p of r.value.daily ?? []) {
      const e = dailyMap.get(p.date) ?? { ad: 0, iap: 0 }
      e.ad += p.ad
      e.iap += p.iap
      dailyMap.set(p.date, e)
    }
  })

  raw.apps = raw.apps.map((a) => ({ ...a, ...(merged[a.name] ?? {}) }))
  if (dailyMap.size > 0) {
    raw.daily = [...dailyMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({ date, ...v }))
  }
  if (errors.length > 0) raw.errors = errors
  return raw
}
