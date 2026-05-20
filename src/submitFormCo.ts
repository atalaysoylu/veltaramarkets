export type FormCoResult = { ok: true } | { ok: false; message?: string }

/**
 * Form bildirimleri → `/api/submit-form` → info@veltaramarkets.com (Resend).
 * Tarayıcıdan formsubmit.co çağrılmaz (CORS + 522 sorunları).
 */
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

  try {
    const res = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ fields, options, formPageUrl }),
    })

    let data: { ok?: boolean; message?: string } = {}
    try {
      data = (await res.json()) as typeof data
    } catch {
      data = {}
    }

    if (data.ok === true) return { ok: true }
    return {
      ok: false,
      message:
        typeof data.message === 'string'
          ? data.message
          : res.ok
            ? undefined
            : `API HTTP ${res.status}`,
    }
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'network_error',
    }
  }
}
