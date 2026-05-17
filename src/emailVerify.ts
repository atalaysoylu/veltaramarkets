/** /api/send-verification-code ve /api/verify-code istemci tarafı sarmalayıcısı. */

export type SendCodeResult =
  | { ok: true; token: string; expiresInSec: number }
  | { ok: false; reason: SendCodeReason; detail?: string }

export type SendCodeReason =
  | 'invalid_email'
  | 'email_failed'
  | 'network_error'
  | 'unknown'

export type VerifyCodeResult =
  | { ok: true }
  | { ok: false; reason: VerifyCodeReason }

export type VerifyCodeReason =
  | 'missing_fields'
  | 'invalid_token'
  | 'email_mismatch'
  | 'expired'
  | 'invalid_code'
  | 'network_error'
  | 'unknown'

async function postJson<T>(url: string, body: unknown): Promise<T | { __networkError: true }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    let data: unknown
    try {
      data = await res.json()
    } catch {
      data = null
    }
    if (data && typeof data === 'object') return data as T
    return { __networkError: true }
  } catch {
    return { __networkError: true }
  }
}

export async function sendVerificationCode(email: string): Promise<SendCodeResult> {
  const data = await postJson<{
    ok: boolean
    token?: string
    expiresInSec?: number
    reason?: string
    detail?: string
  }>('/api/send-verification-code', { email })

  if ('__networkError' in data) return { ok: false, reason: 'network_error' }

  if (data.ok && typeof data.token === 'string' && typeof data.expiresInSec === 'number') {
    return { ok: true, token: data.token, expiresInSec: data.expiresInSec }
  }
  const reason = isSendCodeReason(data.reason) ? data.reason : 'unknown'
  return { ok: false, reason, detail: data.detail }
}

export async function verifyCode(
  email: string,
  code: string,
  token: string,
): Promise<VerifyCodeResult> {
  const data = await postJson<{ ok: boolean; reason?: string }>('/api/verify-code', {
    email,
    code,
    token,
  })
  if ('__networkError' in data) return { ok: false, reason: 'network_error' }
  if (data.ok) return { ok: true }
  return { ok: false, reason: isVerifyReason(data.reason) ? data.reason : 'unknown' }
}

function isSendCodeReason(r: unknown): r is SendCodeReason {
  return (
    r === 'invalid_email' ||
    r === 'email_failed' ||
    r === 'network_error' ||
    r === 'unknown'
  )
}

function isVerifyReason(r: unknown): r is VerifyCodeReason {
  return (
    r === 'missing_fields' ||
    r === 'invalid_token' ||
    r === 'email_mismatch' ||
    r === 'expired' ||
    r === 'invalid_code' ||
    r === 'network_error' ||
    r === 'unknown'
  )
}
