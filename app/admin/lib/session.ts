import { SignJWT, jwtVerify } from 'jose'

// /admin のセッション。Google OAuth (/api/auth/callback/google) で ADMIN_EMAIL と
// 一致したときだけ発行する署名JWT。ステートレスなのでDB不要。
export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30日

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET)

export function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret())
}

export async function verifySessionToken(token: string | undefined): Promise<{ email: string } | null> {
  if (!token || !process.env.AUTH_SECRET) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    return typeof payload.email === 'string' ? { email: payload.email } : null
  } catch {
    return null
  }
}
