import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useI18n } from './i18n/I18nProvider'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
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

export function LoginForm() {
  const { t } = useI18n()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    const em = email.trim()
    if (!em || !password) {
      setErrorMessage(t('auth.errRequired'))
      return
    }
    if (!isValidEmail(em)) {
      setErrorMessage(t('auth.errEmail'))
      return
    }
    if (!login(em, password)) {
      setErrorMessage(t('auth.errLogin'))
      return
    }
    navigate('/live-account/panel', { replace: true })
  }

  return (
    <form className="lp-form lp-live-account-form lp-auth-form" onSubmit={handleSubmit} noValidate>
      <div className="lp-auth-fields">
        <div className="lp-field">
          <label htmlFor="login-email">{t('liveAccount.email')}</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="lp-field">
          <label htmlFor="login-password">{t('liveAccount.password')}</label>
          <div className="lp-live-input-icon">
            <input
              id="login-password"
              type={showPwd ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

      {errorMessage ? (
        <p className="lp-form-error lp-auth-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="lp-btn lp-btn-lg lp-form-submit lp-live-submit lp-auth-submit"
      >
        {t('auth.loginSubmit')}
      </button>
    </form>
  )
}
