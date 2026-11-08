import type { IconName } from '../icons'

export interface AdminNavItem {
  icon: IconName
  label: string
  // Path below /admin ('' is the overview)
  path: '' | '/apps' | '/revenue' | '/users' | '/sources' | '/notifications'
}

export const ADMIN_NAV: AdminNavItem[] = [
  { icon: 'overview', label: '概要', path: '' },
  { icon: 'apps', label: 'アプリ', path: '/apps' },
  { icon: 'revenue', label: '収益', path: '/revenue' },
  { icon: 'users', label: 'ユーザー', path: '/users' },
  { icon: 'database', label: 'データ', path: '/sources' },
  { icon: 'settings', label: '通知', path: '/notifications' },
]

// On the admin.* subdomain the browser path has no /admin prefix
export const isCurrentNav = (pathname: string, path: AdminNavItem['path']): boolean => {
  const p = pathname.replace(/^\/admin/, '')
  return path === '' ? p === '' || p === '/' : p === path || p.startsWith(`${path}/`)
}
