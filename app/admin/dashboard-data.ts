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

const dStyle = (d: number): DeltaBadge =>
  d >= 0
    ? { dColor: '#0B6B4B', dBg: '#E3F5EC', delta: '▲ ' + d.toFixed(1) + '%' }
    : { dColor: '#A3241F', dBg: '#FCE8E6', delta: '▼ ' + Math.abs(d).toFixed(1) + '%' }

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
    return { ...a, color: a.deployed ? a.color : '#9AA4B2', adV: ad, iapV: iap, totalV: ad + iap, dlV: a.dl * f, dauV: a.dau, d: a.delta * dm }
  })
  const sum = (k: 'adV' | 'iapV' | 'totalV' | 'dlV' | 'dauV') => apps.reduce((s, a) => s + a[k], 0)
  const totalRevV = sum('totalV')
  const adT = sum('adV')
  const iapT = sum('iapV')
  const dlT = sum('dlV')
  const dauT = sum('dauV')
  const arpdau = totalRevV / (dauT * period)

  const kd = period === 7 ? [4.2, 1.8, 6.3, 3.1] : period === 90 ? [18.6, 9.4, 14.2, 4.8] : [8.9, 3.6, 9.7, 5.2]
  const kpis: Kpi[] = [
    { label: '総ダウンロード数', value: num(dlT), ...dStyle(kd[0]) },
    { label: '平均DAU（全アプリ）', value: num(dauT), ...dStyle(kd[1]) },
    { label: '総収益', value: yen(totalRevV), ...dStyle(kd[2]) },
    { label: 'ARPDAU', value: '¥' + arpdau.toFixed(1), ...dStyle(kd[3]) },
  ]

  const iosList = apps.filter((a) => a.plat.indexOf('iOS') >= 0)
  const avgRet = iosList.reduce((s, a) => s + a.ret * a.dau, 0) / iosList.reduce((s, a) => s + a.dau, 0)
  const spKd = period === 7 ? [4.2, 1.8, 3.1, 0.6] : period === 90 ? [18.6, 9.4, 4.8, 2.2] : [8.9, 3.6, 5.2, 1.4]
  const spKpis: Kpi[] = [
    { label: 'ダウンロード', value: num(dlT), ...dStyle(spKd[0]) },
    { label: '平均DAU', value: num(dauT), ...dStyle(spKd[1]) },
    { label: 'ARPDAU', value: '¥' + arpdau.toFixed(1), ...dStyle(spKd[2]) },
    { label: '保持率（7日後・iOSのみ）', value: avgRet.toFixed(1) + '%', ...dStyle(spKd[3]) },
  ]
  const revD = period === 7 ? 6.3 : period === 90 ? 14.2 : 9.7

  const n = period === 90 ? 13 : period
  const step = period === 90 ? 7 : 1
  const rnd = (i: number) => {
    const x = Math.sin(i * 12.9898 + period) * 43758.5453
    return x - Math.floor(x)
  }
  const rawBars: { v: number; ad: number; iap: number; md: string }[] = []
  const daily = raw.daily ?? []
  const end = daily.length > 0 ? new Date(daily[daily.length - 1].date + 'T00:00:00') : new Date(2026, 9, 25)
  if (daily.length >= n * step) {
    // Real daily revenue: bucket into days (7/30) or weeks (90).
    const tail = daily.slice(-n * step)
    for (let i = 0; i < n; i++) {
      const chunk = tail.slice(i * step, (i + 1) * step)
      const ad = chunk.reduce((s, p) => s + p.ad, 0)
      const iap = chunk.reduce((s, p) => s + p.iap, 0)
      const md = Number(chunk[chunk.length - 1].date.slice(5, 7)) + '/' + Number(chunk[chunk.length - 1].date.slice(8))
      rawBars.push({ v: ad + iap, ad, iap, md })
    }
  } else {
    for (let i = 0; i < n; i++) {
      const v = (totalRevV / n) * (0.72 + 0.42 * rnd(i) + 0.28 * (i / n))
      const adShare = 0.42 + 0.12 * rnd(i + 31)
      const d = new Date(end.getTime() - (n - 1 - i) * step * 86400000)
      rawBars.push({ v, ad: v * adShare, iap: v * (1 - adShare), md: d.getMonth() + 1 + '/' + d.getDate() })
    }
  }
  const maxV = Math.max(...rawBars.map((r) => r.v))
  const maxPc = maxV * 1.08
  const maxSp = maxV * 1.05
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
      pct: Math.round((a.totalV / totalRevV) * 100),
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
      ret: a.plat.indexOf('iOS') >= 0 ? a.ret + '%' : '—',
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
      pct: Math.round((a.totalV / totalRevV) * 100),
      dl: num(a.dlV),
      dau: num(a.dau),
      ret: a.plat.indexOf('iOS') >= 0 ? a.ret + '%' : '—',
      ...dStyle(a.delta * dm),
    }))

  const sel = APPS[appIndex]
  const r2 = (i: number) => {
    const x = Math.sin(i * 78.233 + 3.1) * 43758.5453
    return x - Math.floor(x)
  }
  const users = sel.churn?.users ?? Math.round(sel.dau * 3.4)
  const BUCKET_LABELS = ['7日以内', '8〜30日', '31〜60日', '61日以上'] as const
  const BUCKET_BASE = [0.46, 0.22, 0.14, 0.18] as const
  const fracs = sel.churn
    ? [...sel.churn.fractions]
    : BUCKET_BASE.map((b, j) => b * (0.8 + 0.4 * r2(appIndex * 7 + j)))
  const sumB = fracs.reduce((s, v) => s + v, 0)
  const buckets: Bucket[] = BUCKET_LABELS.map((label, j) => {
    const p = (fracs[j] / sumB) * 100
    return { label, color: BUCKET_COLORS[j], w: p.toFixed(1), pct: p.toFixed(1) + '%', count: num((users * p) / 100) }
  })
  const churnV = ((fracs[2] + fracs[3]) / sumB) * 100
  const hasIos = sel.plat.indexOf('iOS') >= 0
  const hasAndroid = sel.plat.indexOf('Android') >= 0
  const RET_LABELS = ['翌日', '7日後', '28日後'] as const
  const retVals = sel.retention
    ? [sel.retention.d1, sel.retention.d7, sel.retention.d28]
    : [0.42, 0.21, 0.11].map((v, j) => v * (0.8 + 0.4 * r2(appIndex * 13 + j + 40)) * 100)
  const retention: Retention[] = RET_LABELS.map((label, j) => ({
    label,
    pct: retVals[j].toFixed(1) + '%',
    w: retVals[j].toFixed(1),
  }))

  const start = new Date(end.getTime() - (period - 1) * 86400000)
  const fmt = (d: Date) => d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()

  return {
    rangeLabel: fmt(start) + ' 〜 ' + fmt(end),
    rangeShort: '過去' + period + '日',
    startLabel: start.getMonth() + 1 + '/' + start.getDate(),
    bucketLabel: period === 90 ? '週ごと' : '日ごと',
    kpis,
    spKpis,
    totalRev: yen(totalRevV),
    revDelta: '▲ ' + revD.toFixed(1) + '% 前期間比',
    bars,
    spBars,
    barGapPc: period === 7 ? '14px' : period === 30 ? '4px' : '8px',
    barGapSp: period === 7 ? '10px' : period === 30 ? '2px' : '6px',
    yTop: yenS(maxPc),
    yMid: yenS(maxPc / 2),
    adPct: Math.round((adT / totalRevV) * 100),
    iapPct: 100 - Math.round((adT / totalRevV) * 100),
    adTotal: yen(adT),
    iapTotal: yen(iapT),
    share,
    rows,
    cards,
    exitApp: sel.name,
    churn: churnV.toFixed(1) + '%',
    users: num(users),
    churnUsers: num((users * churnV) / 100),
    buckets,
    hasIos,
    hasAndroid,
    retention,
    devices: sel.retention ? num(sel.retention.devices) : num(sel.dau * 2.1),
    deletions: sel.retention ? num(sel.retention.deletions) : num(sel.dl * f * 0.18),
    appOptions: apps.map((a) => ({ name: a.name, color: a.color })),
  }
}
