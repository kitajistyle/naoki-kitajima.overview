import type { AdminRaw } from './lib/types'

export type Period = 7 | 30 | 90
export type SortKey = 'total' | 'dau' | 'dl'

export interface DeltaBadge {
  dColor: string
  dBg: string
  delta: string
}

export interface Kpi extends DeltaBadge {
  label: string
  value: string
}

export interface Bar {
  adH: string
  iapH: string
  label: string
  tip: string
}

export interface ShareItem {
  name: string
  color: string
  rev: string
  pct: number
}

export interface TableRow extends DeltaBadge {
  name: string
  cat: string
  plat: string
  color: string
  initial: string
  dl: string
  dau: string
  ret: string
  ad: string
  iap: string
  total: string
}

export interface AppCard extends DeltaBadge {
  name: string
  plat: string
  color: string
  initial: string
  total: string
  pct: number
  dl: string
  dau: string
  ret: string
}

export interface Bucket {
  label: string
  color: string
  w: string
  pct: string
  count: string
}

export interface Retention {
  label: string
  pct: string
  w: string
}

export interface AppOption {
  name: string
  color: string
}

export interface DashboardView {
  rangeLabel: string
  rangeShort: string
  startLabel: string
  bucketLabel: string
  updatedPc: string
  updatedSp: string
  kpis: Kpi[]
  spKpis: Kpi[]
  totalRev: string
  revDelta: string
  bars: Bar[]
  spBars: Pick<Bar, 'adH' | 'iapH'>[]
  barGapPc: string
  barGapSp: string
  yTop: string
  yMid: string
  adPct: number
  iapPct: number
  adTotal: string
  iapTotal: string
  share: ShareItem[]
  rows: TableRow[]
  cards: AppCard[]
  exitApp: string
  churn: string
  users: string
  churnUsers: string
  buckets: Bucket[]
  hasIos: boolean
  hasAndroid: boolean
  retention: Retention[]
  devices: string
  deletions: string
  appOptions: AppOption[]
}

const BUCKET_COLORS = ['#2456E8', '#9DB5F5', '#F0A04B', '#C2410C']

const yen = (n: number) => '¥' + Math.round(n).toLocaleString('ja-JP')
const yenS = (n: number) => (n >= 10000 ? '¥' + (n / 10000).toFixed(1) + '万' : yen(n))
const num = (n: number) => Math.round(n).toLocaleString('ja-JP')

const dStyle = (d: number | undefined): DeltaBadge =>
  d === undefined
    ? { dColor: '#5B6270', dBg: '#E6E9EE', delta: '—' }
    : d >= 0
      ? { dColor: '#0B6B4B', dBg: '#E3F5EC', delta: '▲ ' + d.toFixed(1) + '%' }
      : { dColor: '#A3241F', dBg: '#FCE8E6', delta: '▼ ' + Math.abs(d).toFixed(1) + '%' }

const UNKNOWN = '—'

export function buildDashboardView(
  raw: AdminRaw,
  {
    period,
    sort,
    appIndex,
  }: {
    period: Period
    sort: SortKey
    appIndex: number
  }
): DashboardView {
  const APPS = raw.apps
  const f = period === 7 ? 7 / 30 : period === 90 ? 3 : 1
  const dm = period === 7 ? 0.6 : period === 90 ? 1.4 : 1

  const apps = APPS.map((a) => {
    const ad = a.ad * f
    const iap = a.iap * f
    return { ...a, color: a.deployed ? a.color : '#9AA4B2', adV: ad, iapV: iap, totalV: ad + iap, dlV: a.dl * f, dauV: a.dau, d: a.delta === undefined ? undefined : a.delta * dm }
  })
  const sum = (k: 'adV' | 'iapV' | 'totalV' | 'dlV' | 'dauV') => apps.reduce((s, a) => s + a[k], 0)
  const totalRevV = sum('totalV')
  const adT = sum('adV')
  const iapT = sum('iapV')
  const dlT = sum('dlV')
  const dauT = sum('dauV')
  const arpdau = dauT > 0 ? totalRevV / (dauT * period) : 0

  // Real delta only exists where a source computed it; otherwise show —.
  const kpis: Kpi[] = [
    { label: '総ダウンロード数', value: num(dlT), ...dStyle(undefined) },
    { label: '平均DAU（全アプリ）', value: num(dauT), ...dStyle(undefined) },
    { label: '総収益', value: yen(totalRevV), ...dStyle(undefined) },
    { label: 'ARPDAU', value: '¥' + arpdau.toFixed(1), ...dStyle(undefined) },
  ]

  const iosList = apps.filter((a) => a.plat.indexOf('iOS') >= 0 && typeof a.ret === 'number')
  const iosDau = iosList.reduce((s, a) => s + a.dau, 0)
  const avgRet = iosDau > 0 ? iosList.reduce((s, a) => s + (a.ret ?? 0) * a.dau, 0) / iosDau : undefined
  const spKpis: Kpi[] = [
    { label: 'ダウンロード', value: num(dlT), ...dStyle(undefined) },
    { label: '平均DAU', value: num(dauT), ...dStyle(undefined) },
    { label: 'ARPDAU', value: '¥' + arpdau.toFixed(1), ...dStyle(undefined) },
    { label: '保持率（7日後・iOSのみ）', value: avgRet === undefined ? UNKNOWN : avgRet.toFixed(1) + '%', ...dStyle(undefined) },
  ]

  const n = period === 90 ? 13 : period
  const step = period === 90 ? 7 : 1
  const rawBars: { v: number; ad: number; iap: number; md: string }[] = []
  const daily = raw.daily ?? []
  const end = daily.length > 0 ? new Date(daily[daily.length - 1].date + 'T00:00:00') : new Date()
  // Bucket real daily revenue into days (7/30) or weeks (90); days without a
  // reported value count as 0.
  const dailyMap = new Map(daily.map((p) => [p.date, p]))
  for (let i = 0; i < n; i++) {
    let ad = 0
    let iap = 0
    for (let j = 0; j < step; j++) {
      const d = new Date(end.getTime() - ((n - 1 - i) * step + j) * 86400000)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const p = dailyMap.get(key)
      if (p) {
        ad += p.ad
        iap += p.iap
      }
    }
    const last = new Date(end.getTime() - (n - 1 - i) * step * 86400000)
    rawBars.push({ v: ad + iap, ad, iap, md: last.getMonth() + 1 + '/' + last.getDate() })
  }
  // Real revenue delta: this period vs the previous period of equal length.
  const dailySum = (fromDaysAgo: number, toDaysAgo: number) =>
    daily.reduce((s, p) => {
      const t = new Date(p.date + 'T00:00:00').getTime()
      return t > end.getTime() - toDaysAgo * 86400000 && t <= end.getTime() - fromDaysAgo * 86400000 ? s + p.ad + p.iap : s
    }, 0)
  const curRev = dailySum(0, period)
  const prevRev = dailySum(period, period * 2)
  const revD = prevRev > 0 ? ((curRev - prevRev) / prevRev) * 100 : undefined
  const maxV = Math.max(...rawBars.map((r) => r.v), 0)
  const maxPc = maxV > 0 ? maxV * 1.08 : 1
  const maxSp = maxV > 0 ? maxV * 1.05 : 1
  const labelEvery = period === 7 ? 1 : period === 30 ? 5 : 2
  const bars: Bar[] = rawBars.map((r, i) => {
    const show = i % labelEvery === 0 || i === n - 1
    return {
      adH: ((r.ad / maxPc) * 100).toFixed(2),
      iapH: ((r.iap / maxPc) * 100).toFixed(2),
      label: show ? r.md : '',
      tip: r.md + (period === 90 ? ' の週' : '') + '　広告 ' + yen(r.ad) + ' / 課金 ' + yen(r.iap),
    }
  })
  const spBars = rawBars.map((r) => ({
    adH: ((r.ad / maxSp) * 100).toFixed(2),
    iapH: ((r.iap / maxSp) * 100).toFixed(2),
  }))

  const share: ShareItem[] = [...apps]
    .sort((a, b) => b.totalV - a.totalV)
    .map((a) => ({
      name: a.name,
      color: a.color,
      rev: yenS(a.totalV),
      pct: totalRevV > 0 ? Math.round((a.totalV / totalRevV) * 100) : 0,
    }))

  const sortKey = sort === 'dl' ? 'dlV' : sort === 'dau' ? 'dauV' : 'totalV'
  const rows: TableRow[] = [...apps]
    .sort((a, b) => b[sortKey] - a[sortKey])
    .map((a) => ({
      name: a.name,
      cat: a.cat,
      plat: a.plat,
      color: a.color,
      initial: a.name.slice(-1),
      dl: num(a.dlV),
      dau: num(a.dauV),
      ret: a.ret === undefined ? UNKNOWN : a.ret + '%',
      ad: yen(a.adV),
      iap: yen(a.iapV),
      total: yen(a.totalV),
      ...dStyle(a.d),
    }))

  const cards: AppCard[] = [...apps]
    .sort((a, b) => b.totalV - a.totalV)
    .map((a) => ({
      name: a.name,
      plat: a.plat,
      color: a.color,
      initial: a.name.slice(-1),
      total: yen(a.totalV),
      pct: totalRevV > 0 ? Math.round((a.totalV / totalRevV) * 100) : 0,
      dl: num(a.dlV),
      dau: num(a.dau),
      ret: a.ret === undefined ? UNKNOWN : a.ret + '%',
      ...dStyle(a.d),
    }))

  const sel = APPS[appIndex]
  const hasChurn = sel.churn !== undefined
  const users = sel.churn?.users ?? 0
  const BUCKET_LABELS = ['7日以内', '8〜30日', '31〜60日', '61日以上'] as const
  const fracs = sel.churn ? [...sel.churn.fractions] : [0, 0, 0, 0]
  const sumB = fracs.reduce((s, v) => s + v, 0)
  const buckets: Bucket[] = BUCKET_LABELS.map((label, j) => {
    const p = sumB > 0 ? (fracs[j] / sumB) * 100 : 0
    return {
      label,
      color: BUCKET_COLORS[j],
      w: p.toFixed(1),
      pct: hasChurn ? p.toFixed(1) + '%' : UNKNOWN,
      count: hasChurn ? num((users * p) / 100) : UNKNOWN,
    }
  })
  const churnV = sumB > 0 ? ((fracs[2] + fracs[3]) / sumB) * 100 : undefined
  const hasIos = sel.plat.indexOf('iOS') >= 0
  const hasAndroid = sel.plat.indexOf('Android') >= 0
  const RET_LABELS = ['翌日', '7日後', '28日後'] as const
  const retVals: (number | undefined)[] = sel.retention
    ? [sel.retention.d1, sel.retention.d7, sel.retention.d28]
    : [undefined, undefined, undefined]
  const retention: Retention[] = RET_LABELS.map((label, j) => ({
    label,
    pct: retVals[j] === undefined ? UNKNOWN : retVals[j].toFixed(1) + '%',
    w: retVals[j] === undefined ? '0' : retVals[j].toFixed(1),
  }))

  const start = new Date(end.getTime() - (period - 1) * 86400000)
  const fmt = (d: Date) => d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  const now = new Date()
  const hhmm = (d: Date) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')

  return {
    rangeLabel: fmt(start) + ' 〜 ' + fmt(end),
    rangeShort: '過去' + period + '日',
    startLabel: start.getMonth() + 1 + '/' + start.getDate(),
    bucketLabel: period === 90 ? '週ごと' : '日ごと',
    updatedPc: fmt(now) + ' ' + hhmm(now),
    updatedSp: now.getMonth() + 1 + '/' + now.getDate() + ' ' + hhmm(now),
    kpis,
    spKpis,
    totalRev: yen(totalRevV),
    revDelta: revD === undefined ? UNKNOWN + ' 前期間比' : (revD >= 0 ? '▲ ' : '▼ ') + Math.abs(revD).toFixed(1) + '% 前期間比',
    bars,
    spBars,
    barGapPc: period === 7 ? '14px' : period === 30 ? '4px' : '8px',
    barGapSp: period === 7 ? '10px' : period === 30 ? '2px' : '6px',
    yTop: yenS(maxPc),
    yMid: yenS(maxPc / 2),
    adPct: totalRevV > 0 ? Math.round((adT / totalRevV) * 100) : 0,
    iapPct: totalRevV > 0 ? 100 - Math.round((adT / totalRevV) * 100) : 0,
    adTotal: yen(adT),
    iapTotal: yen(iapT),
    share,
    rows,
    cards,
    exitApp: sel.name,
    churn: churnV === undefined ? UNKNOWN : churnV.toFixed(1) + '%',
    users: hasChurn ? num(users) : UNKNOWN,
    churnUsers: churnV === undefined ? UNKNOWN : num((users * churnV) / 100),
    buckets,
    hasIos,
    hasAndroid,
    retention,
    devices: sel.retention ? num(sel.retention.devices) : UNKNOWN,
    deletions: sel.retention ? num(sel.retention.deletions) : UNKNOWN,
    appOptions: apps.map((a) => ({ name: a.name, color: a.color })),
  }
}
