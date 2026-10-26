import type { Metadata } from 'next'
import { Dashboard } from './dashboard'
import { getAdminRaw } from './lib/aggregate'

export const metadata: Metadata = {
  title: { absolute: 'アプリ ダッシュボード' },
  robots: { index: false, follow: false },
}

// Regenerate at most once an hour — external API calls and page renders only
// happen on revalidation, not per request. IP + Basic auth still run per
// request in proxy.ts.
export const revalidate = 3600

export default async function AdminPage() {
  const raw = await getAdminRaw()
  return <Dashboard raw={raw} />
}
