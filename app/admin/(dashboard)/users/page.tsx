import type { Metadata } from 'next'
import { UsersView } from '../../_dashboard/UsersView'

export const metadata: Metadata = {
  title: { absolute: 'ユーザー | アプリ ダッシュボード' },
  robots: { index: false, follow: false },
}

export default function AdminUsersPage() {
  return <UsersView />
}
