import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import { submitFormCo } from './submitFormCo'
import { normalizeTcknDigits } from './tckn'
import {
  sendVerificationCode,
  verifyCode,
  type SendCodeReason,
  type VerifyCodeReason,
} from './emailVerify'
import { findUserByEmail } from './authStorage'

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

export function LiveAccountForm() {
  const { t } = useI18n()
  const { register } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<'form' | 'verify'>('form')

  const [fullName, setFullName] = useState('')
  const [tckn, setTckn] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
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
        return t('liveAccount.errEmail')
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

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    setErrorMessage('')

    const n = fullName.trim()
    const em = email.trim().toLowerCase()
    const tcknDigits = normalizeTcknDigits(tckn)

    if (!n || !em || !password || !tcknDigits) {
      setErrorMessage(t('liveAccount.errRequired'))
      return
    }
    if (!isValidEmail(em)) {
      setErrorMessage(t('liveAccount.errEmail'))
      return
    }
    if (!meetsPasswordPolicy(password)) {
      setErrorMessage(t('liveAccount.errPassword'))
      return
    }
    if (findUserByEmail(em)) {
      setErrorMessage(t('auth.errRegisterExists'))
      return
    }

    setBusy(true)
    const sent = await sendVerificationCode(em)
    setBusy(false)

    if (!sent.ok) {
      setErrorMessage(mapSendError(sent.reason))
      return
    }
    setToken(sent.token)
    setCode('')
    setResendCooldown(RESEND_COOLDOWN_SEC)
    setStep('verify')
  }

  async function handleResend() {
    if (busy || resendCooldown > 0) return
    setErrorMessage('')
    setBusy(true)
    const sent = await sendVerificationCode(email.trim().toLowerCase())
    setBusy(false)
    if (!sent.ok) {
      setErrorMessage(mapSendError(sent.reason))
      return
    }
    setToken(sent.token)
    setCode('')
    setResendCooldown(RESEND_COOLDOWN_SEC)
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
    if (!result.ok) {
      setBusy(false)
      setErrorMessage(mapVerifyError(result.reason))
      return
    }

    const n = fullName.trim()
    const tcknDigits = normalizeTcknDigits(tckn)
    const registered = register({ email: em, fullName: n, tckn: tcknDigits, password })
    if (registered === 'exists') {
      setBusy(false)
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

    setBusy(false)
    navigate('/live-account/panel', { replace: true })
  }

  function handleBackToForm() {
    if (busy) return
    setErrorMessage('')
    setStep('form')
    setCode('')
  }

  if (step === 'verify') {
    return (
      <form
        className="lp-form lp-live-account-form lp-auth-form"
        onSubmit={handleSubmitVerify}
        noValidate
      >
        <div className="lp-auth-verify-head">
          <h3 className="lp-auth-verify-title">{t('liveAccount.verifyTitle')}</h3>
          <p className="lp-auth-verify-sub">
            {formatTemplate(t('liveAccount.verifySub'), { email: email.trim().toLowerCase() })}
          </p>
        </div>

        <div className="lp-auth-fields">
          <div className="lp-field">
            <label htmlFor="live-code">{t('liveAccount.verifyCodeLabel')}</label>
            <input
              ref={codeInputRef}
              id="live-code"
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
          {busy ? t('liveAccount.verifySubmitting') : t('liveAccount.verifySubmit')}
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
            onClick={handleBackToForm}
            disabled={busy}
          >
            {t('liveAccount.verifyBack')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form className="lp-form lp-live-account-form lp-auth-form" onSubmit={handleSubmitForm} noValidate>
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
        disabled={busy}
      >
        {busy ? t('liveAccount.sendingCode') : t('liveAccount.sendCode')}
      </button>
    </form>
  )
}
