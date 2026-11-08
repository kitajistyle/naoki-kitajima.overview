import type { AdminRaw, ReportedMetric, SourcePatch, SourceStatus } from './types'
import { baseRaw } from './base'
import { SOURCES } from './sources'

// Fetches all configured sources in parallel and merges their results over the
// app registry. Fields a source doesn't provide stay 0/undefined and are not
// marked as reported, so the dashboard hides them. Each source's health
// (unconfigured / ok / partial / error) is recorded in raw.sources.
export async function getAdminRaw(): Promise<AdminRaw> {
  const raw = baseRaw()

  const results = await Promise.all(
    SOURCES.map(async (s): Promise<{ status: SourceStatus; patch?: SourcePatch }> => {
      const base = { id: s.id, name: s.name, provides: s.provides, messages: [], apps: [], dailyRows: 0 }
      const missing = s.env.filter((k) => !process.env[k])
      if (missing.length > 0) return { status: { ...base, state: 'unconfigured', missing } }
      try {
        const patch = await s.fetch()
        const apps = Object.keys(patch.apps)
        const messages = patch.errors ?? []
        const dailyRows = patch.daily?.length ?? 0
        const state = messages.length === 0 ? 'ok' : apps.length > 0 || dailyRows > 0 ? 'partial' : 'error'
        return { status: { ...base, state, missing: [], messages, apps, dailyRows }, patch }
      } catch (e) {
        const message = e instanceof Error ? e.message : '取得に失敗しました'
        return { status: { ...base, state: 'error', missing: [], messages: [message] } }
      }
    })
  )

  const merged: Record<string, SourcePatch['apps'][string]> = {}
  const dailyMap = new Map<string, { ad: number; iap: number }>()
  let dailyReported = false
  for (const { patch } of results) {
    if (!patch) continue
    for (const [name, p] of Object.entries(patch.apps)) {
      merged[name] = { ...merged[name], ...p }
    }
    if (patch.daily !== undefined) dailyReported = true
    for (const p of patch.daily ?? []) {
      const e = dailyMap.get(p.date) ?? { ad: 0, iap: 0 }
      e.ad += p.ad
      e.iap += p.iap
      dailyMap.set(p.date, e)
    }
  }

  const METRICS: ReportedMetric[] = ['dl', 'dau', 'ad', 'iap']
  raw.apps = raw.apps.map((a) => {
    const patch = merged[a.name] ?? {}
    const reported = Object.fromEntries(
      METRICS.filter((m) => patch[m] !== undefined).map((m) => [m, true as const])
    )
    return { ...a, ...patch, reported }
  })
  if (dailyReported) {
    raw.daily = [...dailyMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({ date, ...v }))
  }

  raw.sources = results.map((r) => r.status)
  raw.checkedAt = new Date().toISOString()
  const errors = raw.sources.flatMap((s) => s.messages.map((m) => `${s.name}: ${m}`))
  if (errors.length > 0) raw.errors = errors
  return raw
}
