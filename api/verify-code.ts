import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  hashCode,
  timingSafeStringEqual,
  verifyPayload,
} from './_lib/verifyToken'

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
