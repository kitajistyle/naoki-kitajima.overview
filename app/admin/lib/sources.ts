import type { SourcePatch } from './types'
import { fetchAppStoreMetrics } from './appstore'
import { fetchAdmobMetrics } from './admob'
import { fetchPlayMetrics } from './play'
import { fetchDbStats } from './dbstats'
import { fetchRevenueCatMetrics } from './revenuecat'

export interface SourceDef {
  id: string
  name: string
  provides: string[]
  // Every env var the fetcher needs; any missing one means "unconfigured"
  env: string[]
  fetch: () => Promise<SourcePatch>
}

export const SOURCES: SourceDef[] = [
  {
    id: 'appstore',
    name: 'App Store Connect',
    provides: ['iOS のダウンロード', '課金収益', '日別収益', '前期間比'],
    env: ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY', 'ASC_VENDOR_NUMBER', 'ASC_APP_IDS'],
    fetch: fetchAppStoreMetrics,
  },
  {
    id: 'admob',
    name: 'AdMob',
    provides: ['広告収益', '日別広告収益'],
    env: ['ADMOB_CLIENT_ID', 'ADMOB_CLIENT_SECRET', 'ADMOB_REFRESH_TOKEN', 'ADMOB_PUBLISHER_ID', 'ADMOB_APP_IDS'],
    fetch: fetchAdmobMetrics,
  },
  {
    id: 'play',
    name: 'Google Play',
    provides: ['Android のダウンロード'],
    env: ['GOOGLE_SERVICE_ACCOUNT_JSON', 'PLAY_REPORTING_BUCKET', 'PLAY_APP_PACKAGES'],
    fetch: fetchPlayMetrics,
  },
  {
    id: 'db',
    name: 'アプリのバックエンド DB',
    provides: ['DAU', '30日離脱率'],
    env: ['ADMIN_STATS_ENDPOINTS'],
    fetch: fetchDbStats,
  },
  {
    id: 'revenuecat',
    name: 'RevenueCat',
    provides: ['サブスク収益', 'DAU', 'ダウンロード（新規顧客）'],
    env: ['RC_API_KEY', 'RC_PROJECT_ID', 'RC_APP_NAME'],
    fetch: fetchRevenueCatMetrics,
  },
]
