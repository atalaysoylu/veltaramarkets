import { Fragment, useCallback, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  addDepositRequest,
  getDepositDraft,
  setDepositDraft,
} from './authStorage'
import {
  DEPOSIT_BANKS,
  DEPOSIT_CRYPTO,
  allDepositFundingOptions,
  depositFundingLogoSrc,
  fundingOptionById,
  fundingOptionDraftName,
  isDepositCrypto,
  type DepositBank,
  type DepositFundingOption,
} from './depositBanks'
import { copyTextToClipboard } from './copyToClipboard'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import {
  compactIban,
  compactIbansJoined,
  cryptoAddressFor,
  normalizeBankId,
  recipientAccountsForSenderBank,
  type IbanInfo,
} from './paymentConfig'
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

function fundingFromDraft(
  draft: ReturnType<typeof getDepositDraft>,
  banks: DepositBank[],
): DepositFundingOption | null {
  if (!draft?.bankId) return null
  return fundingOptionById(draft.bankId, banks) ?? null
}

function filterFundingOptions(
  query: string,
  banks: DepositBank[],
): DepositFundingOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return allDepositFundingOptions(banks)

  const cryptoMatches = DEPOSIT_CRYPTO.filter((c) => {
    const blob = `${c.name} ${c.subtitle} ${c.address}`.toLowerCase()
    if (blob.includes(q)) return true
    if (
      (q.includes('usdt') || q.includes('tether') || q.includes('usd')) &&
      c.id === 'crypto-usdt-trc20'
    )
      return true
    if (
      (q.includes('btc') || q.includes('bitcoin')) &&
      c.id === 'crypto-btc'
    )
      return true
    if (
      (q.includes('trc20') || q.includes('tron') || q.includes('trx')) &&
      c.id === 'crypto-usdt-trc20'
    )
      return true
    return false
  })

  const bankMatches = banks.filter((b) => b.name.toLowerCase().includes(q))
  return [...cryptoMatches, ...bankMatches]
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

function DepositFundingLogoMark({
  option,
  small,
}: {
  option: DepositFundingOption
  small?: boolean
}) {
  const [imgFailed, setImgFailed] = useState(false)

  const baseCls = ['lp-deposit-bank-avatar', small ? 'lp-deposit-bank-avatar--sm' : '']
    .filter(Boolean)
    .join(' ')

  if (imgFailed) {
    return (
      <span
        className={baseCls}
        style={{ backgroundColor: option.color }}
        aria-hidden
      >
        {option.initial}
      </span>
    )
  }

  return (
    <span className={`${baseCls} lp-deposit-bank-avatar--logo`} aria-hidden>
      <img
        src={depositFundingLogoSrc(option)}
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
  const [pickedFunding, setPickedFunding] = useState<DepositFundingOption | null>(null)
  const [amountRaw, setAmountRaw] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [clipboardHint, setClipboardHint] = useState<
    { kind: 'iban'; index: number } | { kind: 'desc' } | { kind: 'wallet' } | null
  >(null)
  const [confirmBusy, setConfirmBusy] = useState(false)
  const paymentConfig = usePaymentConfig()

  const draft = getDepositDraft()
  const availableBanks = useMemo(() => {
    const idsFromConfig = new Set(
      paymentConfig.recipientAccounts
        .flatMap((a) => a.senderBankIds ?? [])
        .map((id) => normalizeBankId(id)),
    )
    if (idsFromConfig.size === 0) return DEPOSIT_BANKS
    const filtered = DEPOSIT_BANKS.filter((b) => idsFromConfig.has(normalizeBankId(b.id)))
    return filtered.length > 0 ? filtered : DEPOSIT_BANKS
  }, [paymentConfig.recipientAccounts])
  const selectedFunding = pickedFunding ?? fundingFromDraft(draft, availableBanks)

  const goStep = useCallback(
    (s: string) => {
      setSearchParams({ step: s }, { replace: false })
      setErrorMessage('')
    },
    [setSearchParams],
  )

  const filteredFundingOptions = useMemo(
    () => filterFundingOptions(search, availableBanks),
    [search, availableBanks],
  )

  const methodForComplete = fundingFromDraft(draft, availableBanks)
  const draftAmount =
    typeof draft?.amountTry === 'number'
      ? draft.amountTry
      : parseTryAmount(amountRaw)

  const cryptoComplete =
    methodForComplete !== null && isDepositCrypto(methodForComplete)

  const senderBankIdForIban =
    methodForComplete && !isDepositCrypto(methodForComplete) ? methodForComplete.id : undefined

  const depositRecipientRows = useMemo(
    () =>
      recipientAccountsForSenderBank(senderBankIdForIban, paymentConfig.recipientAccounts),
    [senderBankIdForIban, paymentConfig.recipientAccounts],
  )

  const sameHolderAcross =
    depositRecipientRows.length > 1 &&
    depositRecipientRows.every((r) => r.holder === depositRecipientRows[0]?.holder)

  const displayCryptoAddress =
    methodForComplete && isDepositCrypto(methodForComplete)
      ? cryptoAddressFor(methodForComplete.id, methodForComplete.address, paymentConfig.crypto)
      : ''

  const amountDisplay =
    typeof draftAmount === 'number' ? formatTryInt(draftAmount, locale) : '—'

  const descriptionLine = user
    ? formatTemplate(t('deposit.descriptionLine'), {
        name: user.fullName.toUpperCase(),
      })
    : ''

  function flashClipboardHint(
    next: { kind: 'iban'; index: number } | { kind: 'desc' } | { kind: 'wallet' },
  ) {
    setClipboardHint(next)
    window.setTimeout(() => {
      setClipboardHint((current) => {
        if (!current || current.kind !== next.kind) return current
        if (next.kind === 'iban' && current.kind === 'iban' && current.index !== next.index) {
          return current
        }
        return null
      })
    }, 1600)
  }

  function copyIbanAccount(acct: IbanInfo, toastIndex: number) {
    const ok = copyTextToClipboard(compactIban(acct.iban))
    if (ok) {
      flashClipboardHint({ kind: 'iban', index: toastIndex })
    } else {
      setErrorMessage(t('deposit.copyFailed'))
    }
  }

  function copyDesc() {
    if (!descriptionLine) return
    const ok = copyTextToClipboard(descriptionLine)
    if (ok) {
      flashClipboardHint({ kind: 'desc' })
    } else {
      setErrorMessage(t('deposit.copyFailed'))
    }
  }

  function copyWallet(addr: string) {
    const ok = copyTextToClipboard(addr.trim())
    if (ok) {
      flashClipboardHint({ kind: 'wallet' })
    } else {
      setErrorMessage(t('deposit.copyFailed'))
    }
  }

  function handleContinueBank() {
    if (!selectedFunding) {
      setErrorMessage(t('deposit.errPickBank'))
      return
    }
    setDepositDraft({
      bankId: selectedFunding.id,
      bankName: fundingOptionDraftName(selectedFunding),
    })
    setPickedFunding(null)
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

    const resolvedMethod =
      draftNow.bankId !== undefined
        ? fundingOptionById(draftNow.bankId, availableBanks)
        : undefined

    let kriptoAdres = ''
    let kriptoAg = ''
    if (resolvedMethod && isDepositCrypto(resolvedMethod)) {
      kriptoAdres = cryptoAddressFor(
        resolvedMethod.id,
        resolvedMethod.address,
        paymentConfig.crypto,
      )
      kriptoAg = resolvedMethod.subtitle
    }
    const isCryptoRail = Boolean(kriptoAdres)

    const senderBankId =
      resolvedMethod && !isDepositCrypto(resolvedMethod) ? resolvedMethod.id : undefined
    const depositAccounts = recipientAccountsForSenderBank(
      senderBankId,
      paymentConfig.recipientAccounts,
    )
    const compactIbanVal = isCryptoRail ? '—' : compactIbansJoined(depositAccounts)
    setConfirmBusy(true)
    setErrorMessage('')

    const mail = await submitFormCo(
      {
        form: 'deposit_request',
        kullanici_email: user.email,
        ad_soyad: user.fullName,
        kullanici_id: user.id,
        tc_kimlik_no: user.tckn.trim() ? user.tckn : '—',
        odeme_turu: isCryptoRail ? 'kripto' : 'banka_havalesi',
        gonderen_banka: draftNow.bankName,
        tutar_try: String(draftNow.amountTry),
        alici_iban: isCryptoRail ? '—' : compactIbanVal,
        aciklama: descriptionLine,
        kripto_adres: kriptoAdres,
        kripto_ag: kriptoAg,
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
          {filteredFundingOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`lp-deposit-bank-card ${selectedFunding?.id === opt.id ? 'is-selected' : ''}`}
              onClick={() => {
                setPickedFunding(opt)
                setErrorMessage('')
              }}
            >
              <DepositFundingLogoMark option={opt} />
              {isDepositCrypto(opt) ? (
                <span className="lp-deposit-bank-name">
                  <span className="lp-deposit-method-line">{opt.name}</span>
                  <span className="lp-deposit-method-sub">{opt.subtitle}</span>
                </span>
              ) : (
                <span className="lp-deposit-bank-name">{opt.name}</span>
              )}
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

  return (
    <div className="lp-portal-outer lp-container lp-deposit-flow">
      <button type="button" className="lp-portal-back-btn" onClick={backToAmount}>
        ← {t('deposit.back')}
      </button>
      <div className="lp-deposit-complete-head">
        <h1 className="lp-deposit-complete-title">{t('deposit.completeTitle')}</h1>
        <div className="lp-deposit-complete-sub-row">
          <p>
            {cryptoComplete ? t('deposit.completeSubCrypto') : t('deposit.completeSub')}
          </p>
          {methodForComplete ? (
            <span className="lp-deposit-mini-bank">
              <DepositFundingLogoMark option={methodForComplete} small />
              <span>
                {cryptoComplete
                  ? `${methodForComplete.name} (${methodForComplete.subtitle})`
                  : methodForComplete.name}
              </span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="lp-portal-card lp-deposit-complete-card">
        {!cryptoComplete ? (
          <>
            {sameHolderAcross ? (
              <div className="lp-deposit-complete-row">
                <span className="lp-deposit-complete-k">{t('deposit.recipient')}</span>
                <strong className="lp-deposit-complete-v">{depositRecipientRows[0].holder}</strong>
              </div>
            ) : null}
            {depositRecipientRows.map((acct, idx) => (
              <Fragment key={`${acct.bank}-${acct.iban}-${idx}`}>
                <div
                  className={
                    idx > 0 && sameHolderAcross ? 'lp-deposit-recipient-block-continued' : undefined
                  }
                >
                  {!sameHolderAcross ? (
                    <div className="lp-deposit-complete-row">
                      <span className="lp-deposit-complete-k">{t('deposit.recipient')}</span>
                      <strong className="lp-deposit-complete-v">{acct.holder}</strong>
                    </div>
                  ) : null}
                  <div className="lp-deposit-complete-row">
                    <span className="lp-deposit-complete-k">{t('deposit.recipientBank')}</span>
                    <span className="lp-deposit-complete-v">{acct.bank}</span>
                  </div>
                  {acct.swift.trim() ? (
                    <div className="lp-deposit-complete-row">
                      <span className="lp-deposit-complete-k">{t('deposit.swiftLabel')}</span>
                      <span className="lp-deposit-complete-v">{acct.swift}</span>
                    </div>
                  ) : null}
                  <div className="lp-deposit-copy-block">
                    <span className="lp-deposit-copy-label">IBAN</span>
                    <div className="lp-deposit-copy-row">
                      <code className="lp-deposit-iban">{acct.iban}</code>
                      <button
                        type="button"
                        className="lp-deposit-copy-btn"
                        onClick={() => copyIbanAccount(acct, idx)}
                        aria-label={t('deposit.copyIban')}
                      >
                        <CopyIcon />
                      </button>
                    </div>
                    {clipboardHint?.kind === 'iban' && clipboardHint.index === idx ? (
                      <span className="lp-deposit-copied-hint" role="status">
                        ✓
                      </span>
                    ) : null}
                  </div>
                </div>
              </Fragment>
            ))}
          </>
        ) : null}
        <div className="lp-deposit-complete-row">
          <span className="lp-deposit-complete-k">{t('deposit.amountLabel')}</span>
          <strong className="lp-deposit-complete-v">₺ {amountDisplay}</strong>
        </div>
        {cryptoComplete ? (
          <div className="lp-deposit-complete-row">
            <span className="lp-deposit-complete-k">{t('deposit.networkLabel')}</span>
            <span className="lp-deposit-complete-v">{methodForComplete.subtitle}</span>
          </div>
        ) : null}
        {cryptoComplete ? (
          <div className="lp-deposit-copy-block">
            <span className="lp-deposit-copy-label">{t('deposit.walletLabel')}</span>
            <div className="lp-deposit-copy-row">
              <code className="lp-deposit-iban lp-deposit-wallet">{displayCryptoAddress}</code>
              <button
                type="button"
                className="lp-deposit-copy-btn"
                onClick={() => copyWallet(displayCryptoAddress)}
                aria-label={t('deposit.copyWallet')}
              >
                <CopyIcon />
              </button>
            </div>
            {clipboardHint?.kind === 'wallet' ? (
              <span className="lp-deposit-copied-hint" role="status">
                ✓
              </span>
            ) : null}
          </div>
        ) : null}
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
          {clipboardHint?.kind === 'desc' ? (
            <span className="lp-deposit-copied-hint" role="status">
              ✓
            </span>
          ) : null}
        </div>
      </div>

      <div className="lp-deposit-alert lp-deposit-alert--warn">
        {cryptoComplete ? t('deposit.warnCrypto') : t('deposit.warnDesc')}
      </div>
      <div className="lp-deposit-alert lp-deposit-alert--ok">
        {cryptoComplete ? t('deposit.okCrypto') : t('deposit.okFast')}
      </div>

      <div className="lp-deposit-trust">
        <span>
          <CheckMini /> {t('deposit.trust24')}
        </span>
        {!cryptoComplete ? (
          <span>
            <CheckMini /> {t('deposit.trustFast')}
          </span>
        ) : null}
        <span>
          <CheckMini /> {t('deposit.trustSsl')}
        </span>
      </div>
      {!cryptoComplete ? <p className="lp-deposit-sms-note">{t('deposit.smsNote')}</p> : null}

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
