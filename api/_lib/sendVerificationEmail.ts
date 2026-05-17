/**
 * Resend (https://resend.com) üzerinden doğrulama kodu e-postası gönderir.
 *
 * Anahtarlar bilinçli olarak kod içine gömülmüştür (özel repo varsayımıyla).
 * Değiştirmek için aşağıdaki sabitleri güncelleyin; redeploy yeterlidir.
 */

const RESEND_API_KEY = 're_euzzGwQe_JDZ4v5RF77nimrrHJykxTsjy'
const RESEND_FROM_EMAIL = 'Veltara Markets <no-reply@send.veltaramarkets.com>'

export type SendResult = {
  ok: boolean
  status?: number
  error?: string
}

export async function sendVerificationEmail(
  to: string,
  code: string,
): Promise<SendResult> {
  const apiKey = RESEND_API_KEY
  const from = RESEND_FROM_EMAIL

  const subject = 'Veltara Markets — Doğrulama Kodunuz'
  const html = buildHtml(code)
  const text = buildText(code)

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
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

function buildText(code: string): string {
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

function buildHtml(code: string): string {
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
                <h1 style="margin:0 0 8px;font-size:20px;color:#0f172a">E-postanızı doğrulayın</h1>
                <p style="margin:0 0 20px;color:#334155;font-size:14px;line-height:1.6">
                  Veltara Markets hesap kaydınızı tamamlamak için aşağıdaki <strong>6 haneli kodu</strong>
                  açık olan kayıt ekranına girin. Kod <strong>10 dakika</strong> içinde geçerlidir.
                </p>
                <div style="margin:18px 0;padding:18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;text-align:center">
                  <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:30px;letter-spacing:8px;color:#003366;font-weight:700">
                    ${escapeHtml(code)}
                  </div>
                </div>
                <p style="margin:18px 0 0;color:#475569;font-size:13px;line-height:1.55">
                  Bu işlemi siz başlatmadıysanız bu e-postayı yok sayabilirsiniz; hesabınız oluşturulmaz.
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
