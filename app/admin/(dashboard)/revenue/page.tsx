import type { Metadata } from 'next'
import { RevenueView } from '../../_dashboard/RevenueView'

export const metadata: Metadata = {
  title: { absolute: '収益 | アプリ ダッシュボード' },
  robots: { index: false, follow: false },
}

export default function AdminRevenuePage() {
  return <RevenueView />
}
