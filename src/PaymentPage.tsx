import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import { LanguageSwitch } from './LanguageSwitch'
import { LogoMark } from './LogoMark'
import { FooterLicenses } from './FooterLicenses'
import { FooterRiskBlock } from './FooterRiskBlock'
import './App.css'
import './PaymentPage.css'

const FORM_SECTION_ID = 'analiz'
const WHATSAPP_SUPPORT_URL = 'https://wa.me/447938315394'

type IbanInfo = {
  holder: string
  bank: string
  iban: string
  swift: string
}

type CryptoEntry = {
  label: string
  address: string
}

type PaymentConfig = {
  iban: IbanInfo
  crypto: CryptoEntry[]
}

const FALLBACK_CONFIG: PaymentConfig = {
  iban: {
    holder: 'PİRAMİT BASILI YAYIM HİZMETLERİ PAZARLAMA LİMİTED ŞİRKETİ',
    bank: 'TÜRKİYE İŞ BANKASI',
    iban: 'TR39 0006 4000 0011 0891 4718 90',
    swift: '',
  },
  crypto: [
    { label: 'USDT (TRC20)', address: 'TMfzrSe1Ye8pnDMY9jTzAKrhBNk3G3rWRU' },
  ],
}

function isPaymentConfig(value: unknown): value is PaymentConfig {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  const iban = v.iban as Record<string, unknown> | undefined
  const ibanOk =
    !!iban &&
    typeof iban.holder === 'string' &&
    typeof iban.bank === 'string' &&
    typeof iban.iban === 'string' &&
    typeof iban.swift === 'string'
  const cryptoOk =
    Array.isArray(v.crypto) &&
    v.crypto.every(
      (e) =>
        e &&
        typeof e === 'object' &&
        typeof (e as Record<string, unknown>).label === 'string' &&
        typeof (e as Record<string, unknown>).address === 'string',
    )
  return ibanOk && cryptoOk
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="lp-menu-svg">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="lp-menu-svg">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="lp-wa-icon">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.02 0C5.5 0 .2 5.3.2 11.82c0 2.09.55 4.13 1.59 5.93L0 24l6.45-1.7a11.8 11.8 0 0 0 5.56 1.42h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.32-8.42Zm-8.5 18.25h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.83 1.01 1.02-3.74-.23-.38A9.86 9.86 0 0 1 2.18 11.8c0-5.43 4.42-9.85 9.85-9.85 2.63 0 5.1 1.02 6.96 2.89a9.77 9.77 0 0 1 2.9 6.97c0 5.43-4.43 9.85-9.87 9.85Zm5.4-7.42c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.93 1.15-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46a8.96 8.96 0 0 1-1.65-2.04c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.88 1.2 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.35.19 1.86.11.57-.08 1.76-.72 2-1.42.25-.69.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}

export default function PaymentPage() {
  const { t } = useI18n()
  const [navOpen, setNavOpen] = useState(false)
  const [config, setConfig] = useState<PaymentConfig>(FALLBACK_CONFIG)
  const year = new Date().getFullYear()

  useEffect(() => {
    document.title = t('paymentPage.metaTitle')
  }, [t])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/payment-config', {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad_status'))))
      .then((data: unknown) => {
        if (isPaymentConfig(data)) setConfig(data)
      })
      .catch(() => {
        /* fallback statede kalır */
      })
    return () => controller.abort()
  }, [])

  return (
    <div className="landing lp-payment-page">
      <header className="lp-header">
        <div className="lp-header-inner">
          <Link to="/" className="lp-logo">
            <LogoMark className="lp-logo-mark" />
            <span className="lp-logo-text">Veltara Markets</span>
          </Link>
          <div className="lp-header-end">
            <nav className="lp-nav" aria-label={t('nav.ariaMain')}>
              <Link to={`/#${FORM_SECTION_ID}`}>{t('nav.services')}</Link>
              <Link to={`/#${FORM_SECTION_ID}`}>{t('nav.process')}</Link>
              <Link to={`/#${FORM_SECTION_ID}`}>{t('nav.reviews')}</Link>
              <Link to="/live-account">{t('nav.liveAccount')}</Link>
              <Link to="/payment" className="is-active-route" aria-current="page">
                {t('nav.payment')}
              </Link>
              <a
                href={WHATSAPP_SUPPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="lp-whatsapp-link"
              >
                <WhatsAppIcon />
                <span>{t('nav.whatsapp')}</span>
              </a>
            </nav>
            <div className="lp-header-actions">
              <LanguageSwitch />
              <Link to="/" className="lp-btn lp-btn-ghost lp-btn-header">
                {t('header.home')}
              </Link>
              <Link to={`/#${FORM_SECTION_ID}`} className="lp-btn lp-btn-primary lp-btn-header">
                {t('nav.freeAnalysis')}
              </Link>
              <button
                type="button"
                className="lp-nav-toggle"
                aria-expanded={navOpen}
                aria-controls="lp-mobile-nav-payment"
                onClick={() => setNavOpen((o) => !o)}
              >
                {navOpen ? (
                  <>
                    <CloseIcon /> <span className="sr-only">{t('header.menuClose')}</span>
                  </>
                ) : (
                  <>
                    <MenuIcon /> <span className="sr-only">{t('header.menuOpen')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div
          id="lp-mobile-nav-payment"
          className={`lp-mobile-nav ${navOpen ? 'is-open' : ''}`}
          hidden={!navOpen}
        >
          <div className="lp-mobile-nav__lang">
            <LanguageSwitch />
          </div>
          <Link to={`/#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.services')}
          </Link>
          <Link to={`/#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.process')}
          </Link>
          <Link to={`/#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.reviews')}
          </Link>
          <Link to="/live-account" onClick={() => setNavOpen(false)}>
            {t('nav.liveAccount')}
          </Link>
          <Link to="/payment" onClick={() => setNavOpen(false)}>
            {t('nav.payment')}
          </Link>
          <a
            href={WHATSAPP_SUPPORT_URL}
            onClick={() => setNavOpen(false)}
            target="_blank"
            rel="noreferrer"
            className="lp-whatsapp-link"
          >
            <WhatsAppIcon />
            <span>{t('nav.whatsapp')}</span>
          </a>
        </div>
      </header>

      <main className="lp-payment-main">
        <section className="lp-payment-shell lp-container">
          <h1 className="lp-payment-title">{t('paymentPage.title')}</h1>
          <p className="lp-payment-intro">{t('paymentPage.intro')}</p>

          <div className="lp-payment-grid">
            <article className="lp-payment-card">
              <h2>{t('paymentPage.ibanTitle')}</h2>
              <p>
                <strong>{t('paymentPage.ibanHolder')}:</strong> {config.iban.holder}
              </p>
              <p>
                <strong>{t('paymentPage.ibanBank')}:</strong> {config.iban.bank}
              </p>
              <p className="lp-payment-mono">{config.iban.iban}</p>
              {config.iban.swift ? (
                <p className="lp-payment-mono">{config.iban.swift}</p>
              ) : null}
            </article>

            <article className="lp-payment-card">
              <h2>{t('paymentPage.cryptoTitle')}</h2>
              {config.crypto.length === 0 ? (
                <p className="lp-payment-mono">—</p>
              ) : (
                config.crypto.map((entry) => (
                  <div key={`${entry.label}-${entry.address}`}>
                    <p>
                      <strong>{entry.label}:</strong>
                    </p>
                    <p className="lp-payment-mono">{entry.address}</p>
                  </div>
                ))
              )}
            </article>
          </div>

          <p className="lp-payment-back">
            <Link to="/">{t('paymentPage.backHome')}</Link>
          </p>
        </section>
      </main>

      <footer className="lp-footer" id="gizlilik">
        <div className="lp-container lp-footer-grid">
          <div>
            <span className="lp-footer-brand">Veltara Markets</span>
            <p className="lp-footer-tag">{t('footer.tagline')}</p>
            <div className="lp-footer-contact-card">
              <p className="lp-footer-contact-title">{t('footer.ukOfficeLabel')}</p>
              <p className="lp-footer-contact-line">{t('footer.ukOfficeAddress')}</p>
              <p className="lp-footer-contact-line">
                <strong>{t('footer.supportPhoneLabel')}:</strong>{' '}
                <a href="tel:+447938315394">{t('footer.supportPhoneValue')}</a>
              </p>
              <a
                href={WHATSAPP_SUPPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="lp-footer-contact-wa"
              >
                {t('footer.supportWhatsapp')}
              </a>
            </div>
          </div>
          <div className="lp-footer-links">
            <span className="lp-footer-col-title">{t('footer.colCompany')}</span>
            <Link to={`/#${FORM_SECTION_ID}`}>{t('footer.about')}</Link>
            <Link to="/live-account">{t('nav.liveAccount')}</Link>
            <Link to="/payment">{t('nav.payment')}</Link>
          </div>
          <div className="lp-footer-links">
            <span className="lp-footer-col-title">{t('footer.colLegal')}</span>
            <Link to={`/#${FORM_SECTION_ID}`}>{t('footer.terms')}</Link>
            <Link to={`/#${FORM_SECTION_ID}`}>{t('footer.privacy')}</Link>
          </div>
        </div>
        <div className="lp-container lp-footer-licenses-wrap">
          <FooterLicenses />
        </div>
        <div className="lp-container lp-footer-risk-wrap">
          <FooterRiskBlock />
        </div>
        <div className="lp-container lp-footer-copy-wrap">
          <p className="lp-footer-copy">{formatTemplate(t('footer.copy'), { year })}</p>
        </div>
      </footer>
    </div>
  )
}
