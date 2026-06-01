import crypto from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/* ─────────────────────────── sabitler ─────────────────────────── */

const RESEND_API_KEY = 're_euzzGwQe_JDZ4v5RF77nimrrHJykxTsjy'
const RESEND_FROM_EMAIL = 'Veltara Markets <no-reply@veltaramarkets.com>'
const AUTH_VERIFY_SECRET = 'HQn2mCT7wdm1uqttorRaEzw7F2GO9wfSPV8R41c4mvxmzroCYWPWuD76iouomQYL'

const CODE_TTL_MS = 10 * 60 * 1000

/* ─────────────────────────── token yardımcıları ─────────────────────────── */

type CodePayload = {
  email: string
  codeHash: string
  exp: number
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function hmac(input: string): string {
  return b64urlEncode(crypto.createHmac('sha256', AUTH_VERIFY_SECRET).update(input).digest())
}

function hashCode(code: string, email: string): string {
  return hmac(`code:${email.toLowerCase()}:${code}`)
}

function signPayload(payload: CodePayload): string {
  const data = b64urlEncode(Buffer.from(JSON.stringify(payload), 'utf8'))
  const sig = hmac(data)
  return `${data}.${sig}`
}

type VerifyPurpose = 'register' | 'reset'

/* ─────────────────────────── e-posta gönderimi (Resend) ─────────────────────────── */

function buildText(code: string, purpose: VerifyPurpose): string {
  if (purpose === 'reset') {
    return [
      'Veltara Markets — Şifre Sıfırlama',
      '',
      `Şifrenizi sıfırlamak için doğrulama kodunuz: ${code}`,
      '',
      'Bu kodu 10 dakika içinde girmeniz gerekir.',
      'Bu işlemi siz başlatmadıysanız bu e-postayı yok sayabilirsiniz; şifreniz değişmez.',
      '',
      '— Veltara Markets',
    ].join('\n')
  }
  return [
    'Veltara Markets — Doğrulama Kodu',
    '',
    `Kayıt işlemini tamamlamak için doğrulama kodunuz: ${code}`,
    '',
    'Bu kodu 10 dakika içinde girmeniz gerekir.',
    'Bu işlemi siz başlatmadıysanız bu e-postayı yok sayabilirsiniz.',
    '',
    '— Veltara Markets',
  ].join('\n')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildHtml(code: string, purpose: VerifyPurpose): string {
  const isReset = purpose === 'reset'
  const heading = isReset ? 'Şifrenizi sıfırlayın' : 'E-postanızı doğrulayın'
  const bodyCopy = isReset
    ? 'Şifrenizi sıfırlamak için aşağıdaki <strong>6 haneli kodu</strong> açık olan şifre sıfırlama ekranına girin. Kod <strong>10 dakika</strong> içinde geçerlidir.'
    : 'Veltara Markets hesap kaydınızı tamamlamak için aşağıdaki <strong>6 haneli kodu</strong> açık olan kayıt ekranına girin. Kod <strong>10 dakika</strong> içinde geçerlidir.'
  const footerCopy = isReset
    ? 'Bu işlemi siz başlatmadıysanız bu e-postayı yok sayabilirsiniz; şifreniz değişmez.'
    : 'Bu işlemi siz başlatmadıysanız bu e-postayı yok sayabilirsiniz; hesabınız oluşturulmaz.'
  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:0;background:#f4f6fb;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 12px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden">
            <tr>
              <td style="padding:24px 28px;background:#003366;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.02em">
                Veltara Markets
              </td>
            </tr>
            <tr>
              <td style="padding:28px">
                <h1 style="margin:0 0 8px;font-size:20px;color:#0f172a">${heading}</h1>
                <p style="margin:0 0 20px;color:#334155;font-size:14px;line-height:1.6">
                  ${bodyCopy}
                </p>
                <div style="margin:18px 0;padding:18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;text-align:center">
                  <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:30px;letter-spacing:8px;color:#003366;font-weight:700">
                    ${escapeHtml(code)}
                  </div>
                </div>
                <p style="margin:18px 0 0;color:#475569;font-size:13px;line-height:1.55">
                  ${footerCopy}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.55">
                Otomatik bir mesaj. Yanıtlamayın.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

type SendResult = { ok: boolean; status?: number; error?: string }

async function sendVerificationEmail(
  to: string,
  code: string,
  purpose: VerifyPurpose,
): Promise<SendResult> {
  const subject =
    purpose === 'reset'
      ? 'Veltara Markets — Şifre Sıfırlama Kodunuz'
      : 'Veltara Markets — Doğrulama Kodunuz'
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [to],
        subject,
        html: buildHtml(code, purpose),
        text: buildText(code, purpose),
      }),
    })

    if (!res.ok) {
      let errText = ''
      try {
        errText = await res.text()
      } catch {
        /* ignore */
      }
      return { ok: false, status: res.status, error: errText || `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network_error' }
  }
}

/* ─────────────────────────── HTTP handler ─────────────────────────── */

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function safeJsonParse(s: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(s) as unknown
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function readBody(req: VercelRequest): Record<string, unknown> | null {
  if (typeof req.body === 'string') return safeJsonParse(req.body)
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body as Record<string, unknown>
  }
  return null
}

function readEmail(req: VercelRequest): string | null {
  const body = readBody(req)
  const raw = body?.email
  if (typeof raw !== 'string') return null
  const email = raw.trim().toLowerCase()
  return isValidEmail(email) ? email : null
}

function readPurpose(req: VercelRequest): VerifyPurpose {
  const body = readBody(req)
  const raw = body?.purpose
  return raw === 'reset' ? 'reset' : 'register'
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
  const purpose = readPurpose(req)

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
  const payload: CodePayload = {
    email,
    codeHash: hashCode(code, email),
    exp: Date.now() + CODE_TTL_MS,
  }
  const token = signPayload(payload)

  const sent = await sendVerificationEmail(email, code, purpose)
  if (!sent.ok) {
    res.status(502).json({ ok: false, reason: 'email_failed', detail: sent.error })
    return
  }

  res.status(200).json({
    ok: true,
    token,
    expiresInSec: Math.floor(CODE_TTL_MS / 1000),
  })
}
