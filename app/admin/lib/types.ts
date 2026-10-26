export interface ChurnStats {
  users: number
  // 4 fractions summing to ~1: 7日以内 / 8〜30日 / 31〜60日 / 61日以上
  fractions: [number, number, number, number]
}

export interface RetentionStats {
  d1: number
  d7: number
  d28: number
  devices: number
  deletions: number
}

export interface RawApp {
  name: string
  cat: string
  plat: string
  color: string
  // false のアプリは未デプロイとしてグレー表示する
  deployed: boolean
  dl: number
  dau: number
  // ソースが返さない場合は undefined（UIでは — 表示）
  ret?: number
  ad: number
  iap: number
  delta?: number
  churn?: ChurnStats
  retention?: RetentionStats
}

export interface AdminRaw {
  apps: RawApp[]
  // All-apps-total daily revenue for the recent window, if sources provide it.
  daily?: { date: string; ad: number; iap: number }[]
}

export interface AppPatch {
  dl?: number
  dau?: number
  ret?: number
  ad?: number
  iap?: number
  delta?: number
  churn?: ChurnStats
  retention?: RetentionStats
}

export interface SourcePatch {
  apps: Record<string, AppPatch>
  // Per-source daily revenue contribution (e.g. ad from AdMob, iap from ASC).
  daily?: { date: string; ad: number; iap: number }[]
}
