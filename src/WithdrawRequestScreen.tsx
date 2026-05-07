import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  addWithdrawalRequest,
} from './authStorage'
import { submitFormCo } from './submitFormCo'
import { formCoFailureMessage } from './formCoFailureMessage'
import { useI18n } from './i18n/I18nProvider'

function normalizeIban(raw: string) {
  return raw.replace(/\s/g, '').toUpperCase()
}

function isValidTrIban(normalized: string) {
  return /^TR[0-9]{24}$/.test(normalized)
}

function parseTryAmount(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const n = Number.parseFloat(cleaned)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100) / 100
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="lp-portal-shield-svg">
      <path
        d="M12 21s8-4.5 8-11V5l-8-3-8 3v5c0 6.5 8 11 8 11Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </svg>
  )
}

export default function WithdrawRequestScreen() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [iban, setIban] = useState('')
  const [amountRaw, setAmountRaw] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  const sessionUser = user

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    const normalized = normalizeIban(iban.trim())
    if (!isValidTrIban(normalized)) {
      setErrorMessage(t('withdraw.errIban'))
      return
    }
    const amount = parseTryAmount(amountRaw)
    if (amount === null) {
      setErrorMessage(t('withdraw.errAmount'))
      return
    }

    setSubmitting(true)
    const mail = await submitFormCo(
      {
        form: 'withdraw_request',
        kullanici_email: sessionUser.email,
        ad_soyad: sessionUser.fullName,
        kullanici_id: sessionUser.id,
        hedef_iban: normalized,
        tutar_try: String(amount),
      },
      {
        subject: t('withdraw.emailSubject'),
        replyTo: sessionUser.email,
        ccReplyTo: true,
      },
    )
    setSubmitting(false)

    if (!mail.ok) {
      setErrorMessage(formCoFailureMessage(mail, t, 'portal.errEmailSend'))
      return
    }

    addWithdrawalRequest({
      userId: sessionUser.id,
      iban: normalized,
      amountTry: amount,
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="lp-portal-outer lp-container">
        <div className="lp-portal-card lp-withdraw-card">
          <p className="lp-withdraw-done-title">{t('withdraw.doneTitle')}</p>
          <p className="lp-withdraw-done-body">{t('withdraw.doneBody')}</p>
          <div className="lp-portal-done-actions">
            <Link className="lp-btn lp-portal-submit" to="/live-account/panel">
              {t('deposit.backPanel')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lp-portal-outer lp-container">
      <div className="lp-withdraw-header">
        <Link className="lp-portal-back" to="/live-account/panel">
          ← {t('deposit.back')}
        </Link>
        <h1 className="lp-withdraw-title">{t('withdraw.title')}</h1>
        <p className="lp-withdraw-sub">{t('withdraw.subtitle')}</p>
      </div>

      <div className="lp-portal-card lp-withdraw-card">
        <form className="lp-withdraw-form" onSubmit={handleSubmit} noValidate>
          <div className="lp-withdraw-field">
            <label className="lp-withdraw-label" htmlFor="w-iban">
              {t('withdraw.targetIban')}
            </label>
            <input
              id="w-iban"
              className="lp-withdraw-input"
              placeholder={t('withdraw.ibanPlaceholder')}
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              autoComplete="off"
              aria-invalid={!!errorMessage}
            />
            <p className="lp-withdraw-hint">{t('withdraw.ibanHint')}</p>
          </div>

          <div className="lp-withdraw-field">
            <label className="lp-withdraw-label" htmlFor="w-amount">
              {t('withdraw.amountLabel')}
            </label>
            <input
              id="w-amount"
              className="lp-withdraw-input"
              placeholder={t('withdraw.amountPlaceholder')}
              inputMode="decimal"
              value={amountRaw}
              onChange={(e) => setAmountRaw(e.target.value)}
            />
          </div>

          <div className="lp-withdraw-note">
            <ShieldIcon />
            <p>{t('withdraw.secureNote')}</p>
          </div>

          {errorMessage ? (
            <p className="lp-form-error lp-withdraw-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="lp-btn lp-portal-submit"
            disabled={submitting}
          >
            {submitting ? t('withdraw.submitting') : t('withdraw.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
