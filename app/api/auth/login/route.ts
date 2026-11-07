import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// /admin 未認証時に proxy.ts からここへリダイレクトされる。
// state/nonce を一時Cookieに保存してGoogleの認可URLへ302。
// callback で state を照合し、id_token の nonce を検証する。
export function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return new NextResponse('GOOGLE_CLIENT_ID is not set', { status: 500 })
  }

  const next = request.nextUrl.searchParams.get('next') ?? '/admin'
  const oauth = {
    state: randomBytes(16).toString('base64url'),
    nonce: randomBytes(16).toString('base64url'),
    next: next.startsWith('/') && !next.startsWith('//') ? next : '/admin',
  }

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', new URL('/api/auth/callback/google', request.url).toString())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', oauth.state)
  authUrl.searchParams.set('nonce', oauth.nonce)
  authUrl.searchParams.set('prompt', 'select_account')

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('admin_oauth', JSON.stringify(oauth), {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: 600,
  })
  return response
}
