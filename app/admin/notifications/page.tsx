import type { Metadata } from 'next'
import { NotificationsClient } from './client'
import { configuredChannels } from '../lib/notify'
import config from '../../../data/notifications.json'
import { baseRaw } from '../lib/base'

export const metadata: Metadata = {
  title: { absolute: '通知設定' },
  robots: { index: false, follow: false },
}

// 設定ページは静的でもよいが、チャネル設定状況・Push対応アプリは env 依存の
// ため /admin と同じ1時間キャッシュに揃える。
export const revalidate = 3600

export default async function NotificationsPage() {
  const pushApps = Object.keys(JSON.parse(process.env.ADMIN_PUSH_ENDPOINTS ?? '{}') as Record<string, string>)
  const apps = baseRaw().apps.map((a) => ({ name: a.name, deployed: a.deployed, pushKind: a.pushKind }))

  return (
    <NotificationsClient
      channels={configuredChannels()}
      rules={config}
      pushApps={pushApps}
      apps={apps}
    />
  )
}
