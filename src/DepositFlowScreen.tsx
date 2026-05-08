import { useCallback, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  addDepositRequest,
  getDepositDraft,
  setDepositDraft,
} from './authStorage'
import { DEPOSIT_BANKS, depositBankLogoSrc, type DepositBank } from './depositBanks'
import { copyTextToClipboard } from './copyToClipboard'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import { compactIban } from './paymentConfig'
import { formCoFailureMessage } from './formCoFailureMessage'
import { submitFormCo } from './submitFormCo'
import { usePaymentConfig } from './usePaymentConfig'

const QUICK_AMOUNTS = [5000, 25000, 100000, 500000, 1000000]

const DEPOSIT_BANK_STEP = '/live-account/deposit?step=bank'

function parseTryAmount(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const n = Number.parseFloat(cleaned)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100) / 100
}

function formatTryInt(n: number, locale: string) {
  return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function refCode(userId: string): string {
  const alnum = userId.replace(/[^a-zA-Z0-9]/g, '')
  const tail = alnum.slice(-6).toUpperCase()
  return tail.padStart(6, '0').slice(0, 6)
}

function bankFromDraft(draft: ReturnType<typeof getDepositDraft>): DepositBank | null {
  if (!draft?.bankId) return null
  return DEPOSIT_BANKS.find((x) => x.id === draft.bankId) ?? null
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="lp-deposit-search-svg"
    >
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.75" />
      <path d="m20 20-4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function DepositBankLogoMark({ bank, small }: { bank: DepositBank; small?: boolean }) {
  const [imgFailed, setImgFailed] = useState(false)

  const baseCls = ['lp-deposit-bank-avatar', small ? 'lp-deposit-bank-avatar--sm' : '']
    .filter(Boolean)
    .join(' ')

  if (imgFailed) {
    return (
      <span
        className={baseCls}
        style={{ backgroundColor: bank.color }}
        aria-hidden
      >
        {bank.initial}
      </span>
    )
  }

  return (
    <span className={`${baseCls} lp-deposit-bank-avatar--logo`} aria-hidden>
      <img
        src={depositBankLogoSrc(bank)}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setImgFailed(true)}
      />
    </span>
  )
}

function CheckMini() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 12l4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function DepositFlowScreen() {
  const { user } = useAuth()
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const resolvedStep = searchParams.get('step') || 'bank'

  const [search, setSearch] = useState('')
  const [pickedBank, setPickedBank] = useState<DepositBank | null>(null)
  const [amountRaw, setAmountRaw] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [copyToast, setCopyToast] = useState<'iban' | 'desc' | null>(null)
  const [confirmBusy, setConfirmBusy] = useState(false)
  const paymentConfig = usePaymentConfig()

  const draft = getDepositDraft()
  const selectedBank = pickedBank ?? bankFromDraft(draft)

  const goStep = useCallback(
    (s: string) => {
      setSearchParams({ step: s }, { replace: false })
      setErrorMessage('')
    },
    [setSearchParams],
  )

  const filteredBanks = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return DEPOSIT_BANKS
    return DEPOSIT_BANKS.filter((b) => b.name.toLowerCase().includes(q))
  }, [search])

  const descriptionLine = user
    ? formatTemplate(t('deposit.descriptionLine'), {
        name: user.fullName.toUpperCase(),
        code: refCode(user.id),
      })
    : ''

  const displayIban = paymentConfig.iban.iban

  function copyIban() {
    const compact = compactIban(displayIban)
    const ok = copyTextToClipboard(compact)
    if (ok) {
      setCopyToast('iban')
      window.setTimeout(() => setCopyToast((c) => (c === 'iban' ? null : c)), 1600)
    } else {
      setErrorMessage(t('deposit.copyFailed'))
    }
  }

  function copyDesc() {
    if (!descriptionLine) return
    const ok = copyTextToClipboard(descriptionLine)
    if (ok) {
      setCopyToast('desc')
      window.setTimeout(() => setCopyToast((c) => (c === 'desc' ? null : c)), 1600)
    } else {
      setErrorMessage(t('deposit.copyFailed'))
    }
  }

  function handleContinueBank() {
    if (!selectedBank) {
      setErrorMessage(t('deposit.errPickBank'))
      return
    }
    setDepositDraft({ bankId: selectedBank.id, bankName: selectedBank.name })
    setPickedBank(null)
    setAmountRaw('')
    goStep('amount')
  }

  function handleContinueAmount() {
    const amt = parseTryAmount(amountRaw)
    if (amt === null) {
      setErrorMessage(t('deposit.errAmount'))
      return
    }
    const d = getDepositDraft()
    if (!d?.bankId || !d.bankName) return
    setDepositDraft({
      bankId: d.bankId,
      bankName: d.bankName,
      amountTry: amt,
    })
    goStep('complete')
  }

  function pickQuick(n: number) {
    setAmountRaw(formatTryInt(n, locale))
    setErrorMessage('')
  }

  async function handleConfirmDone() {
    if (!user) return
    const draftNow = getDepositDraft()
    if (
      !draftNow?.bankId ||
      !draftNow.bankName ||
      typeof draftNow.amountTry !== 'number'
    )
      return

    const compactIbanVal = compactIban(paymentConfig.iban.iban)
    setConfirmBusy(true)
    setErrorMessage('')

    const mail = await submitFormCo(
      {
        form: 'deposit_request',
        kullanici_email: user.email,
        ad_soyad: user.fullName,
        kullanici_id: user.id,
        gonderen_banka: draftNow.bankName,
        tutar_try: String(draftNow.amountTry),
        alici_iban: compactIbanVal,
        aciklama: descriptionLine,
      },
      {
        subject: t('deposit.emailSubject'),
        replyTo: user.email,
        ccReplyTo: true,
      },
    )

    setConfirmBusy(false)

    if (!mail.ok) {
      setErrorMessage(formCoFailureMessage(mail, t, 'portal.errEmailSend'))
      return
    }

    addDepositRequest({
      userId: user.id,
      bankId: draftNow.bankId,
      bankName: draftNow.bankName,
      amountTry: draftNow.amountTry,
    })
    setDepositDraft(null)
    navigate('/live-account/panel', { replace: true })
  }

  function backToBank() {
    goStep('bank')
  }

  function backToAmount() {
    const d = getDepositDraft()
    if (typeof d?.amountTry === 'number') {
      setAmountRaw(formatTryInt(d.amountTry, locale))
    }
    goStep('amount')
  }

  if (!user) return null

  if (resolvedStep === 'amount' && !draft?.bankId) {
    return <Navigate to={DEPOSIT_BANK_STEP} replace />
  }

  if (
    resolvedStep === 'complete' &&
    (!draft?.bankId || !draft.bankName || typeof draft.amountTry !== 'number')
  ) {
    return <Navigate to={DEPOSIT_BANK_STEP} replace />
  }

  const bankForComplete = bankFromDraft(draft)
  const draftAmount =
    typeof draft?.amountTry === 'number'
      ? draft.amountTry
      : parseTryAmount(amountRaw)

  if (resolvedStep === 'bank') {
    return (
      <div className="lp-portal-outer lp-container lp-deposit-flow">
        <div className="lp-deposit-bank-head">
          <h1 className="lp-deposit-bank-title">{t('deposit.pickBankTitle')}</h1>
          <p className="lp-deposit-bank-sub">{t('deposit.pickBankSub')}</p>
        </div>
        <div className="lp-deposit-search-wrap">
          <SearchIcon />
          <input
            type="search"
            className="lp-deposit-search"
            placeholder={t('deposit.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('deposit.searchPlaceholder')}
          />
        </div>
        <div className="lp-deposit-bank-grid">
          {filteredBanks.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`lp-deposit-bank-card ${selectedBank?.id === b.id ? 'is-selected' : ''}`}
              onClick={() => {
                setPickedBank(b)
                setErrorMessage('')
              }}
            >
              <DepositBankLogoMark bank={b} />
              <span className="lp-deposit-bank-name">{b.name}</span>
            </button>
          ))}
        </div>
        {errorMessage ? (
          <p className="lp-form-error lp-deposit-flow-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="lp-deposit-sticky-actions">
          <button type="button" className="lp-btn lp-portal-submit" onClick={handleContinueBank}>
            {t('deposit.continue')}
          </button>
        </div>
        <p className="lp-deposit-panel-link">
          <Link to="/live-account/panel">{t('deposit.backPanel')}</Link>
        </p>
      </div>
    )
  }

  if (resolvedStep === 'amount') {
    return (
      <div className="lp-portal-outer lp-container lp-deposit-flow">
        <button type="button" className="lp-portal-back-btn" onClick={backToBank}>
          ← {t('deposit.back')}
        </button>
        <div className="lp-deposit-amount-head">
          <h1 className="lp-deposit-amount-title">{t('deposit.amountTitle')}</h1>
          <p className="lp-deposit-amount-sub">{t('deposit.amountSub')}</p>
        </div>
        <div className="lp-deposit-amount-field">
          <span className="lp-deposit-amount-currency">₺</span>
          <input
            type="text"
            inputMode="decimal"
            className="lp-deposit-amount-input"
            value={amountRaw}
            onChange={(e) => setAmountRaw(e.target.value)}
            aria-label={t('deposit.amountTitle')}
          />
        </div>
        <p className="lp-deposit-quick-label">{t('deposit.quickPick')}</p>
        <div className="lp-deposit-quick-row">
          {QUICK_AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              className={`lp-deposit-chip ${amountRaw === formatTryInt(n, locale) ? 'is-selected' : ''}`}
              onClick={() => pickQuick(n)}
            >
              ₺ {formatTryInt(n, locale)}
            </button>
          ))}
        </div>
        {errorMessage ? (
          <p className="lp-form-error lp-deposit-flow-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <button type="button" className="lp-btn lp-portal-submit" onClick={handleContinueAmount}>
          {t('deposit.continue')}
        </button>
      </div>
    )
  }

  const amountDisplay =
    typeof draftAmount === 'number' ? formatTryInt(draftAmount, locale) : '—'

  return (
    <div className="lp-portal-outer lp-container lp-deposit-flow">
      <button type="button" className="lp-portal-back-btn" onClick={backToAmount}>
        ← {t('deposit.back')}
      </button>
      <div className="lp-deposit-complete-head">
        <h1 className="lp-deposit-complete-title">{t('deposit.completeTitle')}</h1>
        <div className="lp-deposit-complete-sub-row">
          <p>{t('deposit.completeSub')}</p>
          {bankForComplete ? (
            <span className="lp-deposit-mini-bank">
              <DepositBankLogoMark bank={bankForComplete} small />
              <span>{bankForComplete.name}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="lp-portal-card lp-deposit-complete-card">
        <div className="lp-deposit-complete-row">
          <span className="lp-deposit-complete-k">{t('deposit.recipient')}</span>
          <strong className="lp-deposit-complete-v">{paymentConfig.iban.holder}</strong>
        </div>
        <div className="lp-deposit-complete-row">
          <span className="lp-deposit-complete-k">{t('deposit.recipientBank')}</span>
          <span className="lp-deposit-complete-v">{paymentConfig.iban.bank}</span>
        </div>
        <div className="lp-deposit-complete-row">
          <span className="lp-deposit-complete-k">{t('deposit.amountLabel')}</span>
          <strong className="lp-deposit-complete-v">₺ {amountDisplay}</strong>
        </div>
        {paymentConfig.iban.swift.trim() ? (
          <div className="lp-deposit-complete-row">
            <span className="lp-deposit-complete-k">{t('deposit.swiftLabel')}</span>
            <span className="lp-deposit-complete-v">{paymentConfig.iban.swift}</span>
          </div>
        ) : null}
        <div className="lp-deposit-copy-block">
          <span className="lp-deposit-copy-label">IBAN</span>
          <div className="lp-deposit-copy-row">
            <code className="lp-deposit-iban">{displayIban}</code>
            <button
              type="button"
              className="lp-deposit-copy-btn"
              onClick={() => copyIban()}
              aria-label={t('deposit.copyIban')}
            >
              <CopyIcon />
            </button>
          </div>
          {copyToast === 'iban' ? (
            <span className="lp-deposit-copied-hint" role="status">
              ✓
            </span>
          ) : null}
        </div>
        <div className="lp-deposit-copy-block">
          <span className="lp-deposit-copy-label">{t('deposit.descriptionLabel')}</span>
          <div className="lp-deposit-copy-row">
            <code className="lp-deposit-desc">{descriptionLine}</code>
            <button
              type="button"
              className="lp-deposit-copy-btn"
              onClick={() => copyDesc()}
              aria-label={t('deposit.copyDesc')}
            >
              <CopyIcon />
            </button>
          </div>
          {copyToast === 'desc' ? (
            <span className="lp-deposit-copied-hint" role="status">
              ✓
            </span>
          ) : null}
        </div>
      </div>

      <div className="lp-deposit-alert lp-deposit-alert--warn">{t('deposit.warnDesc')}</div>
      <div className="lp-deposit-alert lp-deposit-alert--ok">{t('deposit.okFast')}</div>

      <div className="lp-deposit-trust">
        <span>
          <CheckMini /> {t('deposit.trust24')}
        </span>
        <span>
          <CheckMini /> {t('deposit.trustFast')}
        </span>
        <span>
          <CheckMini /> {t('deposit.trustSsl')}
        </span>
      </div>
      <p className="lp-deposit-sms-note">{t('deposit.smsNote')}</p>

      {errorMessage ? (
        <p className="lp-form-error lp-deposit-mail-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        className="lp-btn lp-portal-submit"
        onClick={() => void handleConfirmDone()}
        disabled={confirmBusy}
      >
        {confirmBusy ? t('deposit.confirming') : t('deposit.confirm')}
      </button>
    </div>
  )
}
