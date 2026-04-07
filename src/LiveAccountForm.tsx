import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from './i18n/I18nProvider'
import { formCoFailureMessage } from './formCoFailureMessage'
import { submitFormCo } from './submitFormCo'
import { LIVE_ACCOUNT_COUNTRY_CODES } from './liveAccountCountries'

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
  const { t, locale } = useI18n()
  const [accountType, setAccountType] = useState<'individual' | 'company'>(
    'individual',
  )
  const [countryCode, setCountryCode] = useState('')
  const [fullName, setFullName] = useState('')
  const [province, setProvince] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [referredBy, setReferredBy] = useState('')
  const [chkNotUS, setChkNotUS] = useState(false)
  const [chkPrivacy, setChkPrivacy] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')

  const regionNames = useMemo(
    () =>
      new Intl.DisplayNames([locale === 'tr' ? 'tr' : 'en'], { type: 'region' }),
    [locale],
  )

  const countryOptions = useMemo(() => {
    return [...LIVE_ACCOUNT_COUNTRY_CODES]
      .map((code) => {
        let name = code
        try {
          name = regionNames.of(code) ?? code
        } catch {
          /* ignore */
        }
        return { code, name }
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, locale === 'tr' ? 'tr' : 'en', {
          sensitivity: 'base',
        }),
      )
  }, [regionNames, locale])

  function countryLabel(): string {
    if (!countryCode) return ''
    try {
      return regionNames.of(countryCode) ?? countryCode
    } catch {
      return countryCode
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (honeypot) return

    setErrorMessage('')
    const n = fullName.trim()
    const c = countryLabel()
    const em = email.trim()

    if (!countryCode || !n || !c || !em || !password || !password2) {
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
    if (password !== password2) {
      setErrorMessage(t('liveAccount.errPasswordMatch'))
      return
    }
    if (!chkNotUS || !chkPrivacy) {
      setErrorMessage(t('liveAccount.errCheckboxes'))
      return
    }

    setStatus('loading')

    const typeLabel =
      accountType === 'individual'
        ? t('liveAccount.individual')
        : t('liveAccount.company')

    const result = await submitFormCo(
      {
        form: 'live_account',
        ad_soyad: n,
        hesap_turu: typeLabel,
        ulke: c,
        ulke_kodu: countryCode,
        il_eyalet: province.trim() || '—',
        email: em,
        telefon: phone.trim() || '—',
        referans: referredBy.trim() || '—',
        abd_mukimi_degil: t('liveAccount.emailConfirmOk'),
        gizlilik_pazarlama_onay: t('liveAccount.emailConfirmOk'),
        sifre_politikasi: t('liveAccount.emailPasswordOk'),
      },
      { subject: t('liveAccount.emailSubject'), replyTo: em, ccReplyTo: true },
    )

    if (!result.ok) {
      setErrorMessage(
        formCoFailureMessage(result, t, 'liveAccount.errSubmit'),
      )
      setStatus('idle')
      return
    }

    setStatus('success')
    setCountryCode('')
    setFullName('')
    setProvince('')
    setEmail('')
    setPhone('')
    setPassword('')
    setPassword2('')
    setReferredBy('')
    setChkNotUS(false)
    setChkPrivacy(false)
  }

  if (status === 'success') {
    return (
      <div className="lp-live-form-success lp-form-success" role="status">
        <p className="lp-form-success-title">{t('liveAccount.successTitle')}</p>
        <p className="lp-live-account-success-body">{t('liveAccount.successBody')}</p>
        <button
          type="button"
          className="lp-btn lp-live-submit lp-live-submit--outline"
          onClick={() => setStatus('idle')}
        >
          {t('liveAccount.newForm')}
        </button>
      </div>
    )
  }

  return (
    <form className="lp-form lp-live-account-form" onSubmit={handleSubmit} noValidate>
      <div className="lp-field lp-field--honeypot" aria-hidden="true">
        <label htmlFor="live-company">{t('liveAccount.honeypotLabel')}</label>
        <input
          id="live-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="lp-live-form-grid">
        <div className="lp-field lp-field--select">
          <label htmlFor="live-country">{t('liveAccount.country')}</label>
          <div className="lp-live-select-wrap">
            <select
              id="live-country"
              name="ulke"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              required
              disabled={status === 'loading'}
            >
              <option value="">{t('liveAccount.countryPlaceholder')}</option>
              {countryOptions.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

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
            disabled={status === 'loading'}
          />
        </div>

        <div className="lp-field">
          <label htmlFor="live-province">{t('liveAccount.province')}</label>
          <input
            id="live-province"
            type="text"
            name="il_eyalet"
            autoComplete="address-level1"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={status === 'loading'}
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
            disabled={status === 'loading'}
          />
        </div>

        <div className="lp-field">
          <label htmlFor="live-phone">{t('liveAccount.phone')}</label>
          <input
            id="live-phone"
            type="tel"
            name="telefon"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={status === 'loading'}
          />
        </div>

        <div className="lp-field">
          <label htmlFor="live-referral">{t('liveAccount.referredBy')}</label>
          <input
            id="live-referral"
            type="text"
            name="referans"
            autoComplete="off"
            value={referredBy}
            onChange={(e) => setReferredBy(e.target.value)}
            disabled={status === 'loading'}
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
              disabled={status === 'loading'}
              aria-describedby="live-pwd-rules"
            />
            <button
              type="button"
              className="lp-live-input-icon-btn"
              tabIndex={-1}
              aria-label={showPwd ? t('liveAccount.toggleHidePassword') : t('liveAccount.toggleShowPassword')}
              onClick={() => setShowPwd((v) => !v)}
              disabled={status === 'loading'}
            >
              <EyeIcon hidden={showPwd} />
            </button>
          </div>
        </div>

        <div className="lp-field">
          <label htmlFor="live-password2">{t('liveAccount.passwordConfirm')}</label>
          <div className="lp-live-input-icon">
            <input
              id="live-password2"
              type={showPwd2 ? 'text' : 'password'}
              name="password_confirm"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              disabled={status === 'loading'}
              aria-describedby="live-pwd-rules"
            />
            <button
              type="button"
              className="lp-live-input-icon-btn"
              tabIndex={-1}
              aria-label={showPwd2 ? t('liveAccount.toggleHidePassword') : t('liveAccount.toggleShowPassword')}
              onClick={() => setShowPwd2((v) => !v)}
              disabled={status === 'loading'}
            >
              <EyeIcon hidden={showPwd2} />
            </button>
          </div>
        </div>
      </div>

      <p id="live-pwd-rules" className="lp-live-form-hint-row">
        <span className="lp-live-form-hint-visible">{t('liveAccount.passwordHintShort')}</span>
        <span className="sr-only">
          {t('liveAccount.passwordHint')} {t('liveAccount.passwordEmailNote')}
        </span>
      </p>

      <fieldset className="lp-field lp-field--radios">
        <legend className="lp-field-legend">{t('liveAccount.accountType')}</legend>
        <div className="lp-live-segment" role="radiogroup" aria-label={t('liveAccount.accountType')}>
          <label className={`lp-live-segment-item ${accountType === 'individual' ? 'is-selected' : ''}`}>
            <input
              type="radio"
              name="accountType"
              value="individual"
              checked={accountType === 'individual'}
              onChange={() => setAccountType('individual')}
              disabled={status === 'loading'}
            />
            <span className="lp-live-segment-box" aria-hidden />
            <span className="lp-live-segment-text">{t('liveAccount.individual')}</span>
          </label>
          <label className={`lp-live-segment-item ${accountType === 'company' ? 'is-selected' : ''}`}>
            <input
              type="radio"
              name="accountType"
              value="company"
              checked={accountType === 'company'}
              onChange={() => setAccountType('company')}
              disabled={status === 'loading'}
            />
            <span className="lp-live-segment-box" aria-hidden />
            <span className="lp-live-segment-text">{t('liveAccount.company')}</span>
          </label>
        </div>
      </fieldset>

      <div className="lp-field lp-field--checkbox">
        <label className="lp-check-label">
          <input
            type="checkbox"
            checked={chkNotUS}
            onChange={(e) => setChkNotUS(e.target.checked)}
            disabled={status === 'loading'}
          />
          <span>{t('liveAccount.chkNotUS')}</span>
        </label>
      </div>

      <div className="lp-field lp-field--checkbox">
        <label className="lp-check-label lp-check-label--multiline">
          <input
            type="checkbox"
            checked={chkPrivacy}
            onChange={(e) => setChkPrivacy(e.target.checked)}
            disabled={status === 'loading'}
          />
          <span>
            {t('liveAccount.chkPrivacyConsent')}{' '}
            {t('liveAccount.chkPrivacyDetailPrefix')}
            <Link to="/#gizlilik" className="lp-live-inline-link">
              {t('liveAccount.privacyLink')}
            </Link>
            {t('liveAccount.chkPrivacyDetailSuffix')}
          </span>
        </label>
      </div>

      {errorMessage ? (
        <p className="lp-form-error lp-live-form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="lp-btn lp-btn-lg lp-form-submit lp-live-submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? t('liveAccount.submitting') : t('liveAccount.submit')}
      </button>
    </form>
  )
}
