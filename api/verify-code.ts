import crypto from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/* ─────────────────────────── sabitler ─────────────────────────── */

const AUTH_VERIFY_SECRET = 'HQn2mCT7wdm1uqttorRaEzw7F2GO9wfSPV8R41c4mvxmzroCYWPWuD76iouomQYL'

/* ─────────────────────────── token yardımcıları ─────────────────────────── */

type CodePayload = {
  email: string
  codeHash: string
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
  return b64urlEncode(crypto.createHmac('sha256', AUTH_VERIFY_SECRET).update(input).digest())
}

function hashCode(code: string, email: string): string {
  return hmac(`code:${email.toLowerCase()}:${code}`)
}

function verifyPayload(token: string): CodePayload | null {
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

function timingSafeStringEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

/* ─────────────────────────── HTTP handler ─────────────────────────── */

type RawBody = {
  email?: unknown
  code?: unknown
  token?: unknown
}

function readBody(req: VercelRequest): RawBody {
  if (typeof req.body === 'string') {
    try {
      const v = JSON.parse(req.body) as unknown
      return v && typeof v === 'object' && !Array.isArray(v) ? (v as RawBody) : {}
    } catch {
      return {}
    }
  }
  return (req.body as RawBody) ?? {}
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method_not_allowed' })
    return
  }
  const body = readBody(req)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const code = typeof body.code === 'string' ? body.code.replace(/\D/g, '') : ''
  const token = typeof body.token === 'string' ? body.token : ''

  if (!email || !code || !token) {
    res.status(400).json({ ok: false, reason: 'missing_fields' })
    return
  }

  const payload = verifyPayload(token)
  if (!payload) {
    res.status(400).json({ ok: false, reason: 'invalid_token' })
    return
  }
  if (payload.email !== email) {
    res.status(400).json({ ok: false, reason: 'email_mismatch' })
    return
  }
  if (Date.now() > payload.exp) {
    res.status(400).json({ ok: false, reason: 'expired' })
    return
  }

  const expected = hashCode(code, email)
  if (!timingSafeStringEqual(expected, payload.codeHash)) {
    res.status(400).json({ ok: false, reason: 'invalid_code' })
    return
  }

  res.status(200).json({ ok: true })
}
