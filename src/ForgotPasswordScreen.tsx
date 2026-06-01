import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { findUserByEmail, updateUserPassword } from './authStorage'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import {
  sendVerificationCode,
  verifyCode,
  type SendCodeReason,
  type VerifyCodeReason,
} from './emailVerify'
import './LiveAccountAuth.css'

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

const RESEND_COOLDOWN_SEC = 30

type Step = 'email' | 'verify' | 'password'

export default function ForgotPasswordScreen() {
  const { user } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showPwdConfirm, setShowPwdConfirm] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const codeInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (step === 'verify') {
      codeInputRef.current?.focus()
    }
  }, [step])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const id = window.setTimeout(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearTimeout(id)
  }, [resendCooldown])

  function mapSendError(reason: SendCodeReason): string {
    switch (reason) {
      case 'invalid_email':
        return t('auth.errEmail')
      case 'email_failed':
        return t('liveAccount.errEmailFailed')
      case 'network_error':
        return t('liveAccount.errNetwork')
      default:
        return t('liveAccount.errSendCode')
    }
  }

  function mapVerifyError(reason: VerifyCodeReason): string {
    switch (reason) {
      case 'invalid_code':
        return t('liveAccount.errCodeInvalid')
      case 'expired':
        return t('liveAccount.errCodeExpired')
      case 'email_mismatch':
        return t('liveAccount.errCodeEmailMismatch')
      case 'network_error':
        return t('liveAccount.errNetwork')
      case 'invalid_token':
      case 'missing_fields':
      default:
        return t('liveAccount.errVerify')
    }
  }

  async function sendResetCode(targetEmail: string) {
    const sent = await sendVerificationCode(targetEmail, 'reset')
    if (!sent.ok) {
      setErrorMessage(mapSendError(sent.reason))
      return false
    }
    setToken(sent.token)
    setCode('')
    setResendCooldown(RESEND_COOLDOWN_SEC)
    return true
  }

  async function handleSubmitEmail(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    setErrorMessage('')

    const em = email.trim().toLowerCase()
    if (!em) {
      setErrorMessage(t('auth.errResetEmailRequired'))
      return
    }
    if (!isValidEmail(em)) {
      setErrorMessage(t('auth.errEmail'))
      return
    }
    if (!findUserByEmail(em)) {
      setErrorMessage(t('auth.errResetNoAccount'))
      return
    }

    setBusy(true)
    const ok = await sendResetCode(em)
    setBusy(false)
    if (!ok) return
    setStep('verify')
  }

  async function handleResend() {
    if (busy || resendCooldown > 0) return
    setErrorMessage('')
    setBusy(true)
    const ok = await sendResetCode(email.trim().toLowerCase())
    setBusy(false)
    if (!ok) return
  }

  async function handleSubmitVerify(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    setErrorMessage('')

    const codeDigits = code.replace(/\D/g, '')
    if (codeDigits.length !== 6) {
      setErrorMessage(t('liveAccount.errCodeFormat'))
      return
    }

    const em = email.trim().toLowerCase()
    setBusy(true)
    const result = await verifyCode(em, codeDigits, token)
    setBusy(false)
    if (!result.ok) {
      setErrorMessage(mapVerifyError(result.reason))
      return
    }
    setStep('password')
  }

  async function handleSubmitPassword(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    setErrorMessage('')

    if (!meetsPasswordPolicy(password)) {
      setErrorMessage(t('liveAccount.errPassword'))
      return
    }
    if (password !== passwordConfirm) {
      setErrorMessage(t('liveAccount.errPasswordMatch'))
      return
    }

    const em = email.trim().toLowerCase()
    setBusy(true)
    const updated = updateUserPassword(em, password)
    setBusy(false)

    if (updated === 'not_found') {
      setErrorMessage(t('auth.errResetNoAccount'))
      return
    }

    navigate('/live-account', { replace: true, state: { resetSuccess: true } })
  }

  if (user) {
    return <Navigate to="/live-account/panel" replace />
  }

  return (
    <div className="lp-container lp-live-account-outer">
      <div className="lp-live-split-card">
        <div className="lp-live-form-panel lp-auth-panel" style={{ maxWidth: '100%' }}>
          <h1 className="lp-live-form-title">{t('auth.resetHeading')}</h1>

          {step === 'email' ? (
            <form
              className="lp-form lp-live-account-form lp-auth-form"
              onSubmit={handleSubmitEmail}
              noValidate
            >
              <div className="lp-auth-fields">
                <div className="lp-field">
                  <label htmlFor="reset-email">{t('liveAccount.email')}</label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                disabled={busy}
              >
                {busy ? t('auth.resetSending') : t('auth.resetSendCode')}
              </button>
            </form>
          ) : null}

          {step === 'verify' ? (
            <form
              className="lp-form lp-live-account-form lp-auth-form"
              onSubmit={handleSubmitVerify}
              noValidate
            >
              <div className="lp-auth-verify-head">
                <h3 className="lp-auth-verify-title">{t('auth.resetVerifyTitle')}</h3>
                <p className="lp-auth-verify-sub">
                  {formatTemplate(t('auth.resetVerifySub'), {
                    email: email.trim().toLowerCase(),
                  })}
                </p>
              </div>

              <div className="lp-auth-fields">
                <div className="lp-field">
                  <label htmlFor="reset-code">{t('liveAccount.verifyCodeLabel')}</label>
                  <input
                    ref={codeInputRef}
                    id="reset-code"
                    type="text"
                    name="verification_code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder={t('liveAccount.verifyCodePlaceholder')}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                </div>
              </div>

              <p className="lp-auth-hint">{t('liveAccount.verifyHint')}</p>

              {errorMessage ? (
                <p className="lp-form-error lp-auth-error" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="lp-btn lp-btn-lg lp-form-submit lp-live-submit lp-auth-submit"
                disabled={busy}
              >
                {busy ? t('auth.resetVerifySubmitting') : t('auth.resetVerifySubmit')}
              </button>

              <div className="lp-auth-verify-actions">
                <button
                  type="button"
                  className="lp-auth-secondary-btn"
                  onClick={handleResend}
                  disabled={busy || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? formatTemplate(t('liveAccount.verifyResendIn'), { sec: resendCooldown })
                    : t('liveAccount.verifyResend')}
                </button>
                <button
                  type="button"
                  className="lp-auth-secondary-btn lp-auth-secondary-btn--ghost"
                  onClick={() => {
                    if (busy) return
                    setErrorMessage('')
                    setStep('email')
                    setCode('')
                  }}
                  disabled={busy}
                >
                  {t('auth.resetVerifyBack')}
                </button>
              </div>
            </form>
          ) : null}

          {step === 'password' ? (
            <form
              className="lp-form lp-live-account-form lp-auth-form"
              onSubmit={handleSubmitPassword}
              noValidate
            >
              <div className="lp-auth-verify-head">
                <h3 className="lp-auth-verify-title">{t('auth.resetNewPasswordHeading')}</h3>
                <p className="lp-auth-verify-sub">{t('auth.resetNewPasswordLead')}</p>
              </div>

              <div className="lp-auth-fields">
                <div className="lp-field">
                  <label htmlFor="reset-password">{t('liveAccount.password')}</label>
                  <div className="lp-live-input-icon">
                    <input
                      id="reset-password"
                      type={showPwd ? 'text' : 'password'}
                      autoComplete="new-password"
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
                <div className="lp-field">
                  <label htmlFor="reset-password-confirm">{t('liveAccount.passwordConfirm')}</label>
                  <div className="lp-live-input-icon">
                    <input
                      id="reset-password-confirm"
                      type={showPwdConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="lp-live-input-icon-btn"
                      tabIndex={-1}
                      aria-label={
                        showPwdConfirm
                          ? t('liveAccount.toggleHidePassword')
                          : t('liveAccount.toggleShowPassword')
                      }
                      onClick={() => setShowPwdConfirm((v) => !v)}
                    >
                      <EyeIcon hidden={showPwdConfirm} />
                    </button>
                  </div>
                </div>
              </div>

              <p className="lp-auth-hint lp-preline">{t('liveAccount.passwordHint')}</p>

              {errorMessage ? (
                <p className="lp-form-error lp-auth-error" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="lp-btn lp-btn-lg lp-form-submit lp-live-submit lp-auth-submit"
                disabled={busy}
              >
                {busy ? t('auth.resetSubmitting') : t('auth.resetSubmit')}
              </button>
            </form>
          ) : null}

          <p className="lp-auth-back">
            <Link to="/live-account">{t('auth.backToLogin')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
