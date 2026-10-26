import { getAdminRaw } from '../../lib/aggregate'

// Consolidated stats API — aggregates every configured source (backends, App
// Store Connect, AdMob, RevenueCat) into one JSON payload. Cached for an hour
// so external API calls happen at most once per revalidation. IP + Basic auth
// is enforced per request by proxy.ts on /admin/*.
export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  return Response.json(await getAdminRaw())
}
