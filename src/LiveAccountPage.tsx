import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import { LanguageSwitch } from './LanguageSwitch'
import { LiveAccountForm } from './LiveAccountForm'
import { LogoMark } from './LogoMark'
import { FooterLicenses } from './FooterLicenses'
import { FooterRiskBlock } from './FooterRiskBlock'
import './App.css'
import './LiveAccountPage.css'

const FORM_SECTION_ID = 'analiz'

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="lp-menu-svg">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="lp-menu-svg">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconProducts() {
  return (
    <svg className="lp-live-aside-icon" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.9" />
      <circle cx="24" cy="10" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="38" cy="24" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="38" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="10" cy="24" r="2.5" fill="currentColor" opacity="0.5" />
      <path
        d="M24 13v8M31 24h-8M24 31v-8M17 24h8"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
      />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className="lp-live-aside-icon" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M24 16v10l6 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 24c-6 0-10-2-12-5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

function IconSpread() {
  return (
    <svg className="lp-live-aside-icon" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M8 36V20l8-6 8 10 8-14 8 6v20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 28h32"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="3 4"
        opacity="0.45"
      />
    </svg>
  )
}

export default function LiveAccountPage() {
  const { t } = useI18n()
  const [navOpen, setNavOpen] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    document.title = t('liveAccount.metaTitle')
  }, [t])

  return (
    <div className="landing lp-live-account-page">
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
              <Link to="/live-account" className="is-active-route" aria-current="page">
                {t('nav.liveAccount')}
              </Link>
              <Link to={`/#${FORM_SECTION_ID}`}>{t('nav.freeAnalysis')}</Link>
            </nav>
            <div className="lp-header-actions">
              <LanguageSwitch />
              <Link to="/" className="lp-btn lp-btn-ghost lp-btn-header">
                {t('header.home')}
              </Link>
              <Link
                to={`/#${FORM_SECTION_ID}`}
                className="lp-btn lp-btn-primary lp-btn-header"
              >
                {t('nav.freeAnalysis')}
              </Link>
              <button
                type="button"
                className="lp-nav-toggle"
                aria-expanded={navOpen}
                aria-controls="lp-mobile-nav-live"
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
          id="lp-mobile-nav-live"
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
          <Link to={`/#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.freeAnalysis')}
          </Link>
        </div>
      </header>

      <main className="lp-live-account-main" id="top">
        <div className="lp-live-account-bg" aria-hidden />
        <div className="lp-container lp-live-account-outer">
          <div className="lp-live-split-card">
            <aside className="lp-live-aside" aria-label={t('liveAccount.title')}>
              <h2 className="lp-live-aside-title">
                {t('liveAccount.asideHeadingBefore')}
                <span className="lp-live-aside-title-accent">
                  {t('liveAccount.asideHeadingAccent')}
                </span>
                {t('liveAccount.asideHeadingAfter')}
              </h2>
              <p className="lp-live-aside-lead lp-preline">{t('liveAccount.asideLead')}</p>
              <ul className="lp-live-aside-list">
                <li>
                  <IconProducts />
                  <div>
                    <strong>{t('liveAccount.asideF1Title')}</strong>
                    <p className="lp-preline">{t('liveAccount.asideF1Body')}</p>
                  </div>
                </li>
                <li>
                  <IconClock />
                  <div>
                    <strong>{t('liveAccount.asideF2Title')}</strong>
                    <p className="lp-preline">{t('liveAccount.asideF2Body')}</p>
                  </div>
                </li>
                <li>
                  <IconSpread />
                  <div>
                    <strong>{t('liveAccount.asideF3Title')}</strong>
                    <p className="lp-preline">{t('liveAccount.asideF3Body')}</p>
                  </div>
                </li>
              </ul>
              <div className="lp-live-aside-deco" aria-hidden>
                <div className="lp-live-aside-orbit" />
                <div className="lp-live-aside-glow" />
              </div>
            </aside>

            <div className="lp-live-form-panel">
              <p className="lp-live-form-notice lp-preline">{t('liveAccount.notice')}</p>
              <h1 className="lp-live-form-title">
                {t('liveAccount.formTitleBefore')}
                <span className="lp-live-form-title-accent">{t('liveAccount.formTitleAccent')}</span>
              </h1>
              <LiveAccountForm />
              <p className="lp-live-account-back">
                <Link to="/">{t('liveAccount.backHome')}</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="lp-footer" id="gizlilik">
        <div className="lp-container lp-footer-grid">
          <div>
            <span className="lp-footer-brand">Veltara Markets</span>
            <p className="lp-footer-tag">{t('footer.tagline')}</p>
          </div>
          <div className="lp-footer-links">
            <span className="lp-footer-col-title">{t('footer.colCompany')}</span>
            <Link to={`/#${FORM_SECTION_ID}`}>{t('footer.about')}</Link>
            <Link to="/live-account">{t('nav.liveAccount')}</Link>
            <Link to={`/#${FORM_SECTION_ID}`}>{t('nav.freeAnalysis')}</Link>
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
          <p className="lp-footer-copy">
            {formatTemplate(t('footer.copy'), { year })}
          </p>
        </div>
      </footer>
    </div>
  )
}
