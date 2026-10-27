import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ja'] as const
type Locale = typeof locales[number]
const defaultLocale: Locale = 'ja'

const isValidLocale = (value: string | undefined): value is Locale =>
  locales.includes(value as Locale)

// app/admin is served at /admin on the main domain and at the root of the
// admin.* subdomain. Access is restricted to ADMIN_ALLOWED_IPS (comma-separated
// IPs or CIDRs) and HTTP Basic auth (ADMIN_BASIC_AUTH_USER /
// ADMIN_BASIC_AUTH_PASSWORD). Loopback is always allowed for local dev.
const clientIp = (request: NextRequest): string | undefined => {
  const fwd = request.headers.get('x-forwarded-for')
  const raw = fwd?.split(',')[0].trim() || request.headers.get('x-real-ip')?.trim()
  return raw?.startsWith('::ffff:') ? raw.slice(7) : raw
}

const v4ToInt = (ip: string): number =>
  ip.split('.').reduce((acc, o) => ((acc << 8) | Number(o)) >>> 0, 0)

const v6ToBigInt = (ip: string): bigint | null => {
  const halves = ip.split('::')
  if (halves.length > 2) return null
  const head = halves[0] ? halves[0].split(':') : []
  const tail = halves.length === 2 ? (halves[1] ? halves[1].split(':') : []) : []
  const missing = 8 - head.length - tail.length
  if (halves.length === 2 ? missing < 1 : missing !== 0) return null
  const groups = [...head, ...Array(missing).fill('0'), ...tail]
  if (groups.length !== 8 || !groups.every((g) => /^[0-9a-fA-F]{1,4}$/.test(g))) return null
  return groups.reduce((acc, g) => (acc << BigInt(16)) + BigInt(`0x${g}`), BigInt(0))
}

const matchIp = (ip: string, entry: string): boolean => {
  const [base, bitsStr] = entry.split('/')
  if (!base || ip.includes('.') !== base.includes('.')) return false
  if (bitsStr === undefined) return ip === base
  const bits = Number(bitsStr)
  if (ip.includes('.')) {
    if (!(bits >= 0 && bits <= 32)) return false
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
    return (v4ToInt(ip) & mask) === (v4ToInt(base) & mask)
  }
  const ipN = v6ToBigInt(ip)
  const baseN = v6ToBigInt(base)
  if (ipN === null || baseN === null || !(bits >= 0 && bits <= 128)) return false
  const mask = ((BigInt(1) << BigInt(bits)) - BigInt(1)) << BigInt(128 - bits)
  return (ipN & mask) === (baseN & mask)
}

const adminProxy = (request: NextRequest, pathname: string, isAdminHost: boolean): NextResponse | undefined => {
  const ip = clientIp(request)
  const allowlist = (process.env.ADMIN_ALLOWED_IPS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const isLoopback = ip === '127.0.0.1' || ip === '::1'
  if (!isLoopback && (!ip || allowlist.length === 0 || !allowlist.some((e) => matchIp(ip, e)))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const user = process.env.ADMIN_BASIC_AUTH_USER
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD
  if (!user || !password) {
    return new NextResponse('Set ADMIN_BASIC_AUTH_USER and ADMIN_BASIC_AUTH_PASSWORD', { status: 403 })
  }
  const expected = `Basic ${btoa(`${user}:${password}`)}`
  if (request.headers.get('authorization') !== expected) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="admin"' },
    })
  }

  if (isAdminHost) {
    const dest = pathname === '/' ? '/admin' : `/admin${pathname}`
    return NextResponse.rewrite(new URL(dest, request.url))
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')?.split(':')[0] ?? ''
  const isAdminHost = host.startsWith('admin.')

  // API routes are never locale-redirected. /api/cron/* is authenticated by
  // CRON_SECRET inside the route itself.
  if (pathname.startsWith('/api/')) return

  if (isAdminHost || pathname === '/admin' || pathname.startsWith('/admin/')) {
    return adminProxy(request, pathname, isAdminHost)
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Cookie > Accept-Language > default
  const cookieLocale = request.cookies.get('locale')?.value
  const acceptLang = request.headers.get('Accept-Language') ?? ''
  const detectedLocale: Locale = acceptLang.toLowerCase().includes('ja') ? 'ja' : defaultLocale
  const locale = isValidLocale(cookieLocale) ? cookieLocale : detectedLocale

  request.nextUrl.pathname = `/${locale}${pathname}`
  const response = NextResponse.redirect(request.nextUrl)

  if (!isValidLocale(cookieLocale)) {
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
