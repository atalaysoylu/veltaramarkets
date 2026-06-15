import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  addWithdrawalRequest,
} from './authStorage'
import { submitFormCo } from './submitFormCo'
import { formCoFailureMessage } from './formCoFailureMessage'
import { useI18n } from './i18n/I18nProvider'

type WithdrawMethod = 'iban' | 'btc' | 'trc20'

function normalizeIban(raw: string) {
  return raw.replace(/\s/g, '').toUpperCase()
}

function isValidTrIban(normalized: string) {
  return /^TR[0-9]{24}$/.test(normalized)
}

function isValidBtcAddress(addr: string) {
  return /^(bc1[a-z0-9]{6,87}|[13][a-zA-Z0-9]{25,34})$/.test(addr.trim())
}

function isValidTrc20Address(addr: string) {
  return /^T[a-zA-Z0-9]{33}$/.test(addr.trim())
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

const METHOD_OPTIONS: { id: WithdrawMethod; labelKey: string }[] = [
  { id: 'iban', labelKey: 'withdraw.methodIban' },
  { id: 'btc', labelKey: 'withdraw.methodBtc' },
  { id: 'trc20', labelKey: 'withdraw.methodTrc20' },
]

export default function WithdrawRequestScreen() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [method, setMethod] = useState<WithdrawMethod>('iban')
  const [iban, setIban] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [amountRaw, setAmountRaw] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  const sessionUser = user
  const isCrypto = method !== 'iban'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage('')

    if (method === 'iban') {
      const normalized = normalizeIban(iban.trim())
      if (!isValidTrIban(normalized)) {
        setErrorMessage(t('withdraw.errIban'))
        return
      }
    } else if (method === 'btc') {
      if (!isValidBtcAddress(walletAddress)) {
        setErrorMessage(t('withdraw.errWallet'))
        return
      }
    } else {
      if (!isValidTrc20Address(walletAddress)) {
        setErrorMessage(t('withdraw.errWallet'))
        return
      }
    }

    const amount = parseTryAmount(amountRaw)
    if (amount === null) {
      setErrorMessage(t('withdraw.errAmount'))
      return
    }

    const normalized = method === 'iban' ? normalizeIban(iban.trim()) : ''
    const networkLabel = method === 'btc' ? 'Bitcoin Network' : method === 'trc20' ? 'TRC20 (Tron)' : ''

    setSubmitting(true)
    const mail = await submitFormCo(
      {
        form: 'withdraw_request',
        kullanici_email: sessionUser.email,
        ad_soyad: sessionUser.fullName,
        kullanici_id: sessionUser.id,
        tc_kimlik_no: sessionUser.tckn.trim() ? sessionUser.tckn : '—',
        odeme_turu: isCrypto ? 'kripto' : 'banka_havalesi',
        hedef_iban: method === 'iban' ? normalized : '—',
        kripto_adres: isCrypto ? walletAddress.trim() : '—',
        kripto_ag: isCrypto ? networkLabel : '—',
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
      iban: method === 'iban' ? normalized : walletAddress.trim(),
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

          {/* Method selector */}
          <div className="lp-withdraw-field">
            <label className="lp-withdraw-label">{t('withdraw.methodLabel')}</label>
            <div className="lp-withdraw-method-row">
              {METHOD_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`lp-withdraw-method-btn${method === opt.id ? ' is-selected' : ''}`}
                  onClick={() => {
                    setMethod(opt.id)
                    setErrorMessage('')
                  }}
                >
                  {t(opt.labelKey as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>

          {/* IBAN field */}
          {method === 'iban' ? (
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
          ) : null}

          {/* Crypto wallet field */}
          {method === 'btc' || method === 'trc20' ? (
            <div className="lp-withdraw-field">
              <label className="lp-withdraw-label" htmlFor="w-wallet">
                {t('withdraw.walletLabel')}
              </label>
              <input
                id="w-wallet"
                className="lp-withdraw-input lp-withdraw-input--mono"
                placeholder={method === 'btc' ? t('withdraw.walletPlaceholderBtc') : t('withdraw.walletPlaceholderTrc20')}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={!!errorMessage}
              />
              <p className="lp-withdraw-hint">
                {method === 'btc' ? t('withdraw.walletHintBtc') : t('withdraw.walletHintTrc20')}
              </p>
            </div>
          ) : null}

          <div className="lp-withdraw-field">
            <label className="lp-withdraw-label" htmlFor="w-amount">
              {method === 'btc'
                ? 'Çekilecek tutar (BTC)'
                : method === 'trc20'
                ? 'Çekilecek tutar (USDT)'
                : t('withdraw.amountLabel')}
            </label>
            <input
              id="w-amount"
              className="lp-withdraw-input"
              placeholder={method === 'btc' ? '0.00000000' : method === 'trc20' ? '0.00' : t('withdraw.amountPlaceholder')}
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
