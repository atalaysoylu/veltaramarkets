import { useState, type FormEvent } from 'react'

/** FormSubmit uç noktası (aktivasyon e-postasındaki anahtar). */
const FORMSUBMIT_FORM_KEY = '80fc6912d4d806ef01cb00e00eda0672'

const SUBMIT_ERROR_SHORT = 'Gönderilemedi. Lütfen tekrar deneyin.'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

type FormSubmitJson = {
  success?: string | boolean
  message?: string
}

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (honeypot) return

    setErrorMessage('')
    const n = name.trim()
    const em = email.trim()
    const msg = message.trim()

    if (!n || !em || !msg) {
      setErrorMessage('Ad soyad, e-posta ve mesaj zorunludur.')
      return
    }
    if (!isValidEmail(em)) {
      setErrorMessage('Geçerli bir e-posta adresi girin.')
      return
    }

    setStatus('loading')

    try {
      const formPageUrl =
        typeof globalThis.location !== 'undefined'
          ? globalThis.location.href
          : ''

      const res = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_FORM_KEY)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: n,
            email: em,
            message: msg,
            telefon: phone.trim() || '—',
            mesaj: msg,
            _subject: 'Meridian Trade - Iletisim formu',
            _replyto: em,
            _url: formPageUrl,
            /** Aynı bildirimin kopyası kullanıcının adresine gider (AJAX ile _autoresponse desteklenmiyor). */
            _cc: em,
            _template: 'table',
            _captcha: 'false',
          }),
        },
      )

      let data: FormSubmitJson
      try {
        data = (await res.json()) as FormSubmitJson
      } catch {
        setErrorMessage(SUBMIT_ERROR_SHORT)
        setStatus('idle')
        return
      }

      const failed =
        !res.ok ||
        data.success === false ||
        data.success === 'false'

      if (failed) {
        setErrorMessage(SUBMIT_ERROR_SHORT)
        setStatus('idle')
        return
      }

      setStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch {
      setErrorMessage(SUBMIT_ERROR_SHORT)
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="lp-form-success" role="status">
        <p className="lp-form-success-title">Mesajınız gönderildi</p>
        <button
          type="button"
          className="lp-btn lp-btn-outline-light lp-btn-header"
          onClick={() => setStatus('idle')}
        >
          Yeni mesaj
        </button>
      </div>
    )
  }

  return (
    <form className="lp-form" onSubmit={handleSubmit} noValidate>
      <div className="lp-field lp-field--honeypot" aria-hidden="true">
        <label htmlFor="contact-company">Şirket</label>
        <input
          id="contact-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="lp-field">
        <label htmlFor="contact-name">Ad soyad *</label>
        <input
          id="contact-name"
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={status === 'loading'}
        />
      </div>

      <div className="lp-field">
        <label htmlFor="contact-email">E-posta *</label>
        <input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
      </div>

      <div className="lp-field">
        <label htmlFor="contact-phone">Telefon</label>
        <input
          id="contact-phone"
          type="tel"
          name="telefon"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={status === 'loading'}
        />
      </div>

      <div className="lp-field">
        <label htmlFor="contact-message">Mesajınız *</label>
        <textarea
          id="contact-message"
          name="mesaj"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={status === 'loading'}
        />
      </div>

      {errorMessage ? (
        <p className="lp-form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="lp-btn lp-btn-primary lp-btn-lg lp-form-submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Gönderiliyor…' : 'Gönder'}
      </button>
    </form>
  )
}
