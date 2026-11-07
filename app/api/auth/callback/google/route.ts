import { createRemoteJWKSet, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '@/app/admin/lib/session'

// Googleの認可コードをid_tokenに交換し、署名・iss・aud・exp・nonceを検証。
// ADMIN_EMAIL と一致した場合のみセッションCookieを発行して `next` へ戻る。
const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

type OAuthState = { state: string; nonce: string; next: string }

export async function GET(request: NextRequest) {
  const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, ADMIN_EMAIL: adminEmail } = process.env
  if (!clientId || !clientSecret || !adminEmail || !process.env.AUTH_SECRET) {
    return new NextResponse('Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_EMAIL and AUTH_SECRET', { status: 500 })
  }

  let stored: OAuthState | null = null
  try {
    stored = JSON.parse(request.cookies.get('admin_oauth')?.value ?? '') as OAuthState
  } catch {
    stored = null
  }
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  if (!stored || !code || state !== stored.state) {
    return new NextResponse('Invalid OAuth state', { status: 400 })
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: new URL('/api/auth/callback/google', request.url).toString(),
    }),
    cache: 'no-store',
  })
  if (!tokenRes.ok) return new NextResponse('Token exchange failed', { status: 502 })
  const { id_token: idToken } = (await tokenRes.json()) as { id_token?: string }
  if (!idToken) return new NextResponse('Token exchange failed', { status: 502 })

  let email = ''
  let verified = false
  try {
    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: clientId,
    })
    if (payload.nonce !== stored.nonce) throw new Error('nonce mismatch')
    email = typeof payload.email === 'string' ? payload.email : ''
    verified = payload.email_verified === true
  } catch {
    return new NextResponse('Invalid id_token', { status: 401 })
  }

  if (!verified || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return new NextResponse(`Forbidden: ${email || 'unknown'}`, { status: 403 })
  }

  const domain = process.env.AUTH_COOKIE_DOMAIN
  const response = NextResponse.redirect(new URL(stored.next, request.url))
  response.cookies.set(SESSION_COOKIE, await createSessionToken(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: SESSION_MAX_AGE,
    ...(domain ? { domain } : {}),
  })
  response.cookies.delete('admin_oauth')
  return response
}
