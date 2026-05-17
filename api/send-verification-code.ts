import crypto from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { hashCode, signPayload, type CodePayload } from './_lib/verifyToken'
import { sendVerificationEmail } from './_lib/sendVerificationEmail'

const CODE_TTL_MS = 10 * 60 * 1000

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function readEmail(req: VercelRequest): string | null {
  const body =
    typeof req.body === 'string'
      ? safeJsonParse(req.body)
      : (req.body as Record<string, unknown> | undefined)
  const raw = body && typeof body === 'object' ? (body as Record<string, unknown>).email : undefined
  if (typeof raw !== 'string') return null
  const email = raw.trim().toLowerCase()
  return isValidEmail(email) ? email : null
}

function safeJsonParse(s: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(s) as unknown
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method_not_allowed' })
    return
  }
  const email = readEmail(req)
  if (!email) {
    res.status(400).json({ ok: false, reason: 'invalid_email' })
    return
  }

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
  const payload: CodePayload = {
    email,
    codeHash: hashCode(code, email),
    exp: Date.now() + CODE_TTL_MS,
  }
  const token = signPayload(payload)

  const sent = await sendVerificationEmail(email, code)
  if (!sent.ok) {
    res
      .status(502)
      .json({ ok: false, reason: 'email_failed', detail: sent.error })
    return
  }

  res.status(200).json({
    ok: true,
    token,
    expiresInSec: Math.floor(CODE_TTL_MS / 1000),
  })
}
