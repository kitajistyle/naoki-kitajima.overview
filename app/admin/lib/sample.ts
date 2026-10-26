import type { AdminRaw } from './types'

const APPS: AdminRaw['apps'] = [
  { name: 'Cypher Map', cat: 'ソーシャル', plat: 'iOS・Web', color: '#2456E8', deployed: true, dl: 5200, dau: 1480, ret: 34, ad: 41200, iap: 63800, delta: 12.4 },
  { name: '乾杯', cat: 'ソーシャル', plat: 'iOS', color: '#7C3AED', deployed: true, dl: 800, dau: 120, ret: 28, ad: 0, iap: 0, delta: 3.2 },
  { name: 'おくすりびより', cat: 'ヘルスケア', plat: 'iOS', color: '#E8445B', deployed: true, dl: 2400, dau: 800, ret: 45, ad: 8500, iap: 3200, delta: 6.8 },
  { name: 'ぽてもち', cat: 'ライフスタイル', plat: 'iOS', color: '#E8820C', deployed: true, dl: 1500, dau: 400, ret: 38, ad: 2100, iap: 0, delta: 4.5 },
  { name: 'naoki-kitajima.overview', cat: 'ポートフォリオ', plat: 'Web', color: '#334155', deployed: true, dl: 0, dau: 0, ret: 0, ad: 0, iap: 0, delta: 0 },
  { name: 'knok', cat: 'ソーシャル', plat: 'iOS・Android', color: '#0F7C6E', deployed: false, dl: 0, dau: 0, ret: 0, ad: 0, iap: 0, delta: 0 },
  { name: 'eat-log', cat: 'フード', plat: 'iOS', color: '#2E9E4F', deployed: false, dl: 0, dau: 0, ret: 0, ad: 0, iap: 0, delta: 0 },
]

export function sampleRaw(): AdminRaw {
  return { apps: APPS.map((a) => ({ ...a })) }
}
