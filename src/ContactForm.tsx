import { useState, type FormEvent } from 'react'
import { useI18n } from './i18n/I18nProvider'
import { formCoFailureMessage } from './formCoFailureMessage'
import { submitFormCo } from './submitFormCo'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function ContactForm() {
  const { t } = useI18n()
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
      setErrorMessage(t('form.errRequired'))
      return
    }
    if (!isValidEmail(em)) {
      setErrorMessage(t('form.errEmail'))
      return
    }

    setStatus('loading')

    try {
      const result = await submitFormCo(
        {
          name: n,
          email: em,
          message: msg,
          telefon: phone.trim() || '—',
          mesaj: msg,
        },
        { subject: t('form.emailSubject'), replyTo: em, ccReplyTo: true },
      )

      if (!result.ok) {
        setErrorMessage(formCoFailureMessage(result, t, 'form.errSubmit'))
        setStatus('idle')
        return
      }

      setStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch {
      setErrorMessage(t('form.errSubmit'))
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="lp-form-success" role="status">
        <p className="lp-form-success-title">{t('form.successTitle')}</p>
        <button
          type="button"
          className="lp-btn lp-btn-outline-light lp-btn-header"
          onClick={() => setStatus('idle')}
        >
          {t('form.newMessage')}
        </button>
      </div>
    )
  }

  return (
    <form className="lp-form" onSubmit={handleSubmit} noValidate>
      <div className="lp-field lp-field--honeypot" aria-hidden="true">
        <label htmlFor="contact-company">{t('form.honeypotLabel')}</label>
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
        <label htmlFor="contact-name">{t('form.name')}</label>
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
        <label htmlFor="contact-email">{t('form.email')}</label>
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
        <label htmlFor="contact-phone">{t('form.phone')}</label>
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
        <label htmlFor="contact-message">{t('form.message')}</label>
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
        {status === 'loading' ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  )
}
