import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/app/admin/lib/session'

export function GET(request: NextRequest) {
  const domain = process.env.AUTH_COOKIE_DOMAIN
  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: 0,
    ...(domain ? { domain } : {}),
  })
  return response
}
