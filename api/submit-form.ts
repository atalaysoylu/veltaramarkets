import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Form bildirimleri → info@veltaramarkets.com
 * FormSubmit.co şu an sürekli 522 veriyor; gönderim Resend ile yapılır.
 * (Doğrulama kodu yalnızca /api/send-verification-code üzerinden kullanıcıya gider.)
 */

const RESEND_API_KEY = 're_euzzGwQe_JDZ4v5RF77nimrrHJykxTsjy'
const RESEND_FROM_EMAIL = 'Veltara Markets <no-reply@veltaramarkets.com>'
const ADMIN_EMAIL = 'info@veltaramarkets.com'

type Attachment = {
  filename: string
  content: string // base64
  contentType?: string
}

type SubmitOptions = {
  subject: string
  replyTo?: string
  ccReplyTo?: boolean
  attachments?: Attachment[]
}

type RawBody = {
  fields?: unknown
  options?: unknown
  formPageUrl?: unknown
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

function isStringRecord(v: unknown): v is Record<string, string> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  return Object.values(v).every((x) => typeof x === 'string')
}

function isValidAttachment(v: unknown): v is Attachment {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  const a = v as Record<string, unknown>
  return typeof a.filename === 'string' && typeof a.content === 'string'
}

function parseOptions(v: unknown): SubmitOptions | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const o = v as Record<string, unknown>
  if (typeof o.subject !== 'string' || !o.subject.trim()) return null
  const out: SubmitOptions = { subject: o.subject.trim() }
  if (typeof o.replyTo === 'string' && o.replyTo.trim()) out.replyTo = o.replyTo.trim()
  if (o.ccReplyTo === true) out.ccReplyTo = true
  if (Array.isArray(o.attachments)) {
    const valid = o.attachments.filter(isValidAttachment)
    if (valid.length) out.attachments = valid
  }
  return out
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600;color:#334155;width:38%">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e2e8f0;color:#0f172a">${escapeHtml(value)}</td></tr>`
}

function buildHtml(subject: string, fields: Record<string, string>, formPageUrl: string): string {
  const rows = Object.entries(fields).map(([k, v]) => row(k, v)).join('')
  const urlRow = formPageUrl ? row('Sayfa', formPageUrl) : ''
  return `<!doctype html><html lang="tr"><body style="margin:0;padding:24px;font-family:Inter,system-ui,sans-serif;background:#f4f6fb;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden">
<tr><td style="padding:16px 20px;background:#003366;color:#fff;font-size:17px;font-weight:700">${escapeHtml(subject)}</td></tr>
<tr><td style="padding:20px"><table width="100%" cellpadding="0" cellspacing="0">${rows}${urlRow}</table></td></tr>
</table></body></html>`
}

function buildText(subject: string, fields: Record<string, string>, formPageUrl: string): string {
  const lines = [subject, '']
  for (const [k, v] of Object.entries(fields)) lines.push(`${k}: ${v}`)
  if (formPageUrl) lines.push(`Sayfa: ${formPageUrl}`)
  lines.push('', '— Veltara Markets (otomatik bildirim)')
  return lines.join('\n')
}

async function sendEmail(
  to: string[],
  subject: string,
  fields: Record<string, string>,
  formPageUrl: string,
  replyTo?: string,
  attachments?: Attachment[],
): Promise<{ ok: boolean; error?: string }> {
  const body: Record<string, unknown> = {
    from: RESEND_FROM_EMAIL,
    to,
    subject,
    html: buildHtml(subject, fields, formPageUrl),
    text: buildText(subject, fields, formPageUrl),
  }
  if (replyTo) body.reply_to = replyTo
  if (attachments && attachments.length > 0) {
    body.attachments = attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
      ...(a.contentType ? { type: a.contentType } : {}),
    }))
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      let errText = ''
      try {
        errText = await res.text()
      } catch {
        /* ignore */
      }
      return { ok: false, error: errText || `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network_error' }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method_not_allowed' })
    return
  }

  const body = readBody(req)
  const fields = body.fields
  const options = parseOptions(body.options)
  const formPageUrl = typeof body.formPageUrl === 'string' ? body.formPageUrl : ''

  if (!isStringRecord(fields) || !options) {
    res.status(400).json({ ok: false, reason: 'invalid_body' })
    return
  }

  // Admin email (always)
  const adminResult = await sendEmail(
    [ADMIN_EMAIL],
    options.subject,
    fields,
    formPageUrl,
    options.replyTo,
    options.attachments,
  )

  if (!adminResult.ok) {
    res.status(502).json({ ok: false, message: adminResult.error })
    return
  }

  // CC to user if ccReplyTo is set and replyTo is provided
  if (options.ccReplyTo && options.replyTo) {
    await sendEmail(
      [options.replyTo],
      options.subject,
      fields,
      formPageUrl,
      undefined,
      options.attachments,
    )
  }

  res.status(200).json({ ok: true })
}
