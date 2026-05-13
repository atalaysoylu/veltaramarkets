import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useI18n } from './i18n/I18nProvider'
import { submitFormCo } from './submitFormCo'
import { isValidTckn, normalizeTcknDigits } from './tckn'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function meetsPasswordPolicy(p: string) {
  if (p.length < 8 || p.length > 16) return false
  if (!/[A-Z]/.test(p)) return false
  if (!/[a-z]/.test(p)) return false
  if (!/[0-9]/.test(p)) return false
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p)) return false
  return true
}

function EyeIcon({ hidden }: { hidden?: boolean }) {
  if (hidden) {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
        <path
          d="M3 3l18 18M10.5 10.5a2 2 0 0 0 3 3M9.9 5.1A10.4 10.4 0 0 1 12 5c4.3 0 8 2.6 9 6a9.7 9.7 0 0 1-4 5.1M6.2 6.2A9.7 9.7 0 0 0 3 11c1 3.4 4.7 6 9 6 1 0 2-.1 2.9-.4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

export function LiveAccountForm() {
  const { t } = useI18n()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [tckn, setTckn] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    const n = fullName.trim()
    const em = email.trim()

    const tcknDigits = normalizeTcknDigits(tckn)

    if (!n || !em || !password || !tcknDigits) {
      setErrorMessage(t('liveAccount.errRequired'))
      return
    }
    if (!isValidEmail(em)) {
      setErrorMessage(t('liveAccount.errEmail'))
      return
    }
    if (!isValidTckn(tcknDigits)) {
      setErrorMessage(t('liveAccount.errTcKimlik'))
      return
    }
    if (!meetsPasswordPolicy(password)) {
      setErrorMessage(t('liveAccount.errPassword'))
      return
    }

    const result = register({ email: em, fullName: n, tckn: tcknDigits, password })
    if (result === 'exists') {
      setErrorMessage(t('auth.errRegisterExists'))
      return
    }

    void submitFormCo(
      {
        form: 'live_account_register',
        kullanici_email: em,
        ad_soyad: n,
        tc_kimlik_no: tcknDigits,
      },
      {
        subject: t('liveAccount.registerEmailSubject'),
        replyTo: em,
        ccReplyTo: true,
      },
    )

    navigate('/live-account/panel', { replace: true })
  }

  return (
    <form className="lp-form lp-live-account-form lp-auth-form" onSubmit={handleSubmit} noValidate>
      <div className="lp-auth-fields">
        <div className="lp-field">
          <label htmlFor="live-fullname">{t('liveAccount.fullName')}</label>
          <input
            id="live-fullname"
            type="text"
            name="ad_soyad"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="lp-field">
          <label htmlFor="live-tckn">{t('liveAccount.tcKimlik')}</label>
          <input
            id="live-tckn"
            type="text"
            name="tc_kimlik_no"
            inputMode="numeric"
            autoComplete="off"
            maxLength={11}
            placeholder={t('liveAccount.tcKimlikPlaceholder')}
            value={tckn}
            onChange={(e) => setTckn(normalizeTcknDigits(e.target.value))}
            required
          />
        </div>

        <div className="lp-field">
          <label htmlFor="live-email">{t('liveAccount.email')}</label>
          <input
            id="live-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="lp-field">
          <label htmlFor="live-password">{t('liveAccount.password')}</label>
          <div className="lp-live-input-icon">
            <input
              id="live-password"
              type={showPwd ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-describedby="live-pwd-rules"
            />
            <button
              type="button"
              className="lp-live-input-icon-btn"
              tabIndex={-1}
              aria-label={
                showPwd
                  ? t('liveAccount.toggleHidePassword')
                  : t('liveAccount.toggleShowPassword')
              }
              onClick={() => setShowPwd((v) => !v)}
            >
              <EyeIcon hidden={showPwd} />
            </button>
          </div>
        </div>
      </div>

      <p id="live-pwd-rules" className="lp-auth-hint">
        {t('liveAccount.passwordHintShort')}
      </p>

      {errorMessage ? (
        <p className="lp-form-error lp-auth-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="lp-btn lp-btn-lg lp-form-submit lp-live-submit lp-auth-submit"
      >
        {t('liveAccount.submit')}
      </button>
    </form>
  )
}
