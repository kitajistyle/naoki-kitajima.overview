import type { AdminRaw } from './types'

// プロダクト登録のみ。指標は全て0/未定義で、各データソースが実値を上書きする。
// pushKind は各プロダクトのPush通知実態:
//   expo    … Expo Pushの送信経路がある（adminから一斉送信可）
//   backend … バックエンドはあるがPush基盤なし（組んでも届け先が無い）
//   local   … ローカル通知のみ（サーバーから送れない）
//   web     … Webアプリのため対象外
const APPS: AdminRaw['apps'] = [
  { name: 'Cypher Map', cat: 'ソーシャル', plat: 'iOS・Web', color: '#2456E8', deployed: true, pushKind: 'expo', dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: '乾杯', cat: 'ソーシャル', plat: 'iOS', color: '#7C3AED', deployed: true, pushKind: 'backend', dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'おくすりびより', cat: 'ヘルスケア', plat: 'iOS', color: '#E8445B', deployed: true, pushKind: 'local', dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'ぽてもち', cat: 'ライフスタイル', plat: 'iOS', color: '#E8820C', deployed: true, pushKind: 'local', dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'naoki-kitajima.overview', cat: 'ポートフォリオ', plat: 'Web', color: '#334155', deployed: true, pushKind: 'web', dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'knok', cat: 'ソーシャル', plat: 'iOS・Android', color: '#0F7C6E', deployed: false, pushKind: 'backend', dl: 0, dau: 0, ad: 0, iap: 0 },
  { name: 'eat-log', cat: 'フード', plat: 'iOS', color: '#2E9E4F', deployed: false, pushKind: 'backend', dl: 0, dau: 0, ad: 0, iap: 0 },
]

export function baseRaw(): AdminRaw {
  return { apps: APPS.map((a) => ({ ...a })) }
}
