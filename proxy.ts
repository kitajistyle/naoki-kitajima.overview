import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ja'] as const
type Locale = typeof locales[number]
const defaultLocale: Locale = 'ja'

const isValidLocale = (value: string | undefined): value is Locale =>
  locales.includes(value as Locale)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

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
