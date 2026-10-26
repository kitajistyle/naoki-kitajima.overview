import type { AdminRaw } from './types'

// プロダクト登録のみ。指標は全て0/未定義で、各データソースが実値を上書きする。
const APPS: AdminRaw['apps'] = [
  { name: 'Cypher Map', cat: 'ソーシャル', plat: 'iOS・Web', color: '#2456E8', deployed: true, dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: '乾杯', cat: 'ソーシャル', plat: 'iOS', color: '#7C3AED', deployed: true, dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'おくすりびより', cat: 'ヘルスケア', plat: 'iOS', color: '#E8445B', deployed: true, dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'ぽてもち', cat: 'ライフスタイル', plat: 'iOS', color: '#E8820C', deployed: true, dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'naoki-kitajima.overview', cat: 'ポートフォリオ', plat: 'Web', color: '#334155', deployed: true, dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'knok', cat: 'ソーシャル', plat: 'iOS・Android', color: '#0F7C6E', deployed: false, dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'eat-log', cat: 'フード', plat: 'iOS', color: '#2E9E4F', deployed: false, dl: 0, dau: 0, ad: 0, iap: 0 },
]

export function baseRaw(): AdminRaw {
  return { apps: APPS.map((a) => ({ ...a })) }
}
