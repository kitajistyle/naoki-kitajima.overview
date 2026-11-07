import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/app/admin/lib/session'

const locales = ['en', 'ja'] as const
type Locale = typeof locales[number]
const defaultLocale: Locale = 'ja'

const isValidLocale = (value: string | undefined): value is Locale =>
  locales.includes(value as Locale)

// app/admin is served at /admin on the main domain and at the root of the
// admin.* subdomain. Access requires the admin_session cookie issued by
// Google OAuth (/api/auth/*). Only ADMIN_EMAIL can complete login, so the
// check here is just the optimistic cookie verify — see docs: "optimistic
// checks with proxy".
const adminProxy = async (request: NextRequest, pathname: string, isAdminHost: boolean): Promise<NextResponse | undefined> => {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  if (!session) {
    if (!isAdminHost && pathname.startsWith('/admin/api/')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const login = new URL('/api/auth/login', request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }

  if (isAdminHost) {
    const dest = pathname === '/' ? '/admin' : `/admin${pathname}`
    return NextResponse.rewrite(new URL(dest, request.url))
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')?.split(':')[0] ?? ''
  const isAdminHost = host.startsWith('admin.')

  // API routes are never locale-redirected. /api/auth/* handles admin login
  // and /api/cron/* is authenticated by CRON_SECRET inside the route itself.
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
