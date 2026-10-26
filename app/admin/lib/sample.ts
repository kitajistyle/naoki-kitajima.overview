import type { AdminRaw } from './types'

const APPS: AdminRaw['apps'] = [
  { name: 'Cypher Map', cat: 'ソーシャル', plat: 'iOS・Web', color: '#2456E8', dl: 5200, dau: 1480, ret: 34, ad: 41200, iap: 63800, delta: 12.4 },
  { name: 'knok', cat: 'ソーシャル', plat: 'iOS・Android', color: '#0F7C6E', dl: 3100, dau: 920, ret: 41, ad: 12600, iap: 48500, delta: 5.1 },
]

export function sampleRaw(): AdminRaw {
  return { apps: APPS.map((a) => ({ ...a })) }
}
