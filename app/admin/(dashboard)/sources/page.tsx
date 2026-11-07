import type { Metadata } from 'next'
import { SourcesView } from '../../_dashboard/SourcesView'

export const metadata: Metadata = {
  title: { absolute: 'データソース | アプリ ダッシュボード' },
  robots: { index: false, follow: false },
}

export default function AdminSourcesPage() {
  return <SourcesView />
}
