import { createSign } from 'node:crypto'

const b64u = (s: string) => Buffer.from(s).toString('base64url')

// GOOGLE_SERVICE_ACCOUNT_JSON: service account JSON (needs Play Developer
// Reporting + GCS read on the reporting bucket). Returns OAuth access token.
export async function googleAccessToken(scope: string): Promise<string | null> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  try {
    const sa = JSON.parse(raw) as { client_email: string; private_key: string }
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: sa.client_email,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }
    const signingInput = `${b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64u(JSON.stringify(payload))}`
    const signature = createSign('RSA-SHA256').update(signingInput).sign(sa.private_key, 'base64url')

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${signingInput}.${signature}`,
      }),
      next: { revalidate: 1800 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { access_token?: string }
    return json.access_token ?? null
  } catch {
    return null
  }
}
