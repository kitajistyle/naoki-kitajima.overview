import type { Metadata } from 'next'
import { OverviewView } from '../_dashboard/OverviewView'

export const metadata: Metadata = {
  title: { absolute: '概要 | アプリ ダッシュボード' },
  robots: { index: false, follow: false },
}

export default function AdminOverviewPage() {
  return <OverviewView />
}
