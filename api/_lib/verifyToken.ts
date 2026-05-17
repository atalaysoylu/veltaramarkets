/**
 * State'siz doğrulama bileti.
 *
 * Token gövdesi base64url(JSON({ email, codeHash, exp })) + "." + hmac.
 * `codeHash`, kullanıcının gireceği 6 haneli kodun (sunucu sırrı + e-posta ile)
 * HMAC-SHA256'sıdır; ham kod hiçbir zaman istemciye geri gönderilmez.
 *
 * Sır bilinçli olarak gömülüdür (özel repo varsayımıyla). Değiştirildiğinde
 * mevcut tüm bekleyen kodlar geçersiz olur — kullanıcılar tekrar kod ister.
 */
import crypto from 'node:crypto'

const SECRET = 'HQn2mCT7wdm1uqttorRaEzw7F2GO9wfSPV8R41c4mvxmzroCYWPWuD76iouomQYL'

export type CodePayload = {
  email: string
  codeHash: string
  /** Unix ms */
  exp: number
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64')
}

function hmac(input: string): string {
  return b64urlEncode(crypto.createHmac('sha256', SECRET).update(input).digest())
}

export function hashCode(code: string, email: string): string {
  return hmac(`code:${email.toLowerCase()}:${code}`)
}

export function signPayload(payload: CodePayload): string {
  const data = b64urlEncode(Buffer.from(JSON.stringify(payload), 'utf8'))
  const sig = hmac(data)
  return `${data}.${sig}`
}

export function verifyPayload(token: string): CodePayload | null {
  const idx = token.indexOf('.')
  if (idx <= 0) return null
  const data = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const expected = hmac(data)
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length) return null
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null
  try {
    const parsed = JSON.parse(b64urlDecode(data).toString('utf8')) as Partial<CodePayload>
    if (
      typeof parsed.email !== 'string' ||
      typeof parsed.codeHash !== 'string' ||
      typeof parsed.exp !== 'number'
    ) {
      return null
    }
    return { email: parsed.email, codeHash: parsed.codeHash, exp: parsed.exp }
  } catch {
    return null
  }
}

export function timingSafeStringEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}
