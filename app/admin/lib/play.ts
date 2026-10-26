import type { SourcePatch } from './types'
import { googleAccessToken } from './google'

// Env: GOOGLE_SERVICE_ACCOUNT_JSON, PLAY_REPORTING_BUCKET (pubsite_prod_rev_...),
// PLAY_APP_PACKAGES as JSON {"<app name>": "<package name>"}.
// Reads the latest monthly installs CSV from the Play reporting GCS bucket
// (stats/installs/) and sums installs per app.
const monthStr = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`

const gcsJson = async (token: string, url: string) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  })
  return res.ok ? res : null
}

export async function fetchPlayMetrics(): Promise<SourcePatch> {
  const token = await googleAccessToken('https://www.googleapis.com/auth/devstorage.read_only')
  const bucket = process.env.PLAY_REPORTING_BUCKET
  const packages = process.env.PLAY_APP_PACKAGES
    ? (JSON.parse(process.env.PLAY_APP_PACKAGES) as Record<string, string>)
    : null
  if (!token || !bucket || !packages) return { apps: {} }

  const apps: SourcePatch['apps'] = {}
  const months = [monthStr(new Date()), monthStr(new Date(Date.now() - 32 * 86400000))]

  for (const [name, pkg] of Object.entries(packages)) {
    try {
      let total = 0
      for (const ym of months) {
        const prefix = `stats/installs/installs_${pkg}_${ym}`
        const list = await gcsJson(
          token,
          `https://storage.googleapis.com/storage/v1/b/${bucket}/o?prefix=${encodeURIComponent(prefix)}&fields=items(name)`
        )
        if (!list) continue
        const { items } = (await list.json()) as { items?: { name: string }[] }
        const target = items?.find((i) => i.name.endsWith('overview.csv')) ?? items?.[0]
        if (!target) continue
        const file = await gcsJson(
          token,
          `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${encodeURIComponent(target.name)}?alt=media`
        )
        if (!file) continue
        const text = await file.text()
        const lines = text.trim().split('\n')
        const header = lines[0].split(',')
        const pkgCol = header.indexOf('Package Name')
        const installCol = header.indexOf('Installs') >= 0 ? header.indexOf('Installs') : header.indexOf('Store Listing Visitors')
        if (installCol < 0) continue
        for (const line of lines.slice(1)) {
          const f = line.split(',')
          if (pkgCol >= 0 && f[pkgCol] !== pkg) continue
          total += Number(f[installCol]) || 0
        }
        break // latest month found is enough
      }
      if (total > 0) apps[name] = { ...apps[name], dl: total }
    } catch {
      // no patch for this app
    }
  }
  return { apps }
}
