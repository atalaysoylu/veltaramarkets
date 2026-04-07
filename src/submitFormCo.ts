import { FORM_RECIPIENT_EMAIL } from './formConfig'

type FormSubmitJson = {
  success?: string | boolean
  message?: string
}

export type FormCoResult = { ok: true } | { ok: false; message?: string }

export async function submitFormCo(
  fields: Record<string, string>,
  options: {
    subject: string
    replyTo?: string
    ccReplyTo?: boolean
  },
): Promise<FormCoResult> {
  const formPageUrl =
    typeof globalThis.location !== 'undefined' ? globalThis.location.href : ''

  const payload: Record<string, unknown> = {
    ...fields,
    _subject: options.subject,
    _template: 'table',
    _captcha: 'false',
    _url: formPageUrl,
  }

  if (options.replyTo) {
    payload._replyto = options.replyTo
    if (options.ccReplyTo) payload._cc = options.replyTo
  }

  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(FORM_RECIPIENT_EMAIL)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  let data: FormSubmitJson
  try {
    data = (await res.json()) as FormSubmitJson
  } catch {
    return { ok: false }
  }

  const failed =
    !res.ok || data.success === false || data.success === 'false'

  if (failed) {
    return {
      ok: false,
      message: typeof data.message === 'string' ? data.message : undefined,
    }
  }
  return { ok: true }
}
