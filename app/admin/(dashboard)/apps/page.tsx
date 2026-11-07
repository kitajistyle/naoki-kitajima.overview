import type { Metadata } from 'next'
import { AppsView } from '../../_dashboard/AppsView'

export const metadata: Metadata = {
  title: { absolute: 'アプリ別 | アプリ ダッシュボード' },
  robots: { index: false, follow: false },
}

export default function AdminAppsPage() {
  return <AppsView />
}
