import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContactForm } from './ContactForm'
import { HeroBanner } from './HeroBanner'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import { LanguageSwitch } from './LanguageSwitch'
import { LogoMark } from './LogoMark'
import { MostTradedSpreadBanner } from './MostTradedSpreadBanner'
import { PaymentMethodsBanner } from './PaymentMethodsBanner'
import { BrokerFeaturesSection } from './BrokerFeaturesSection'
import { GlobalAwardsBanner } from './GlobalAwardsBanner'
import { FooterLicenses } from './FooterLicenses'
import { FooterRiskBlock } from './FooterRiskBlock'
import { TickerBanner } from './TickerBanner'
import './App.css'

const FORM_SECTION_ID = 'analiz'

function IconChart() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 17V9m4 8v-5m4 5v-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconShield() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M12 3a14 14 0 0 0 0 18M12 3a14 14 0 0 1 0 18"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  )
}

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

export default function HomePage() {
  const { t, messages } = useI18n()
  const [navOpen, setNavOpen] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    const m = messages.meta
    document.title = m.pageTitle
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', m.pageDescription)
  }, [messages])

  return (
    <div className="landing">
      <header className="lp-header">
        <div className="lp-header-inner">
          <Link to="/" className="lp-logo">
            <LogoMark className="lp-logo-mark" />
            <span className="lp-logo-text">Veltara Markets</span>
          </Link>
          <div className="lp-header-end">
            <nav className="lp-nav" aria-label={t('nav.ariaMain')}>
              <a href={`#${FORM_SECTION_ID}`}>{t('nav.services')}</a>
              <a href={`#${FORM_SECTION_ID}`}>{t('nav.process')}</a>
              <a href={`#${FORM_SECTION_ID}`}>{t('nav.reviews')}</a>
              <Link to="/live-account">{t('nav.liveAccount')}</Link>
              <a href={`#${FORM_SECTION_ID}`}>{t('nav.freeAnalysis')}</a>
            </nav>
            <div className="lp-header-actions">
              <LanguageSwitch />
              <Link to="/live-account" className="lp-btn lp-btn-ghost lp-btn-header">
                {t('header.openLiveAccount')}
              </Link>
              <a href={`#${FORM_SECTION_ID}`} className="lp-btn lp-btn-primary lp-btn-header">
                {t('nav.freeAnalysis')}
              </a>
              <button
                type="button"
                className="lp-nav-toggle"
                aria-expanded={navOpen}
                aria-controls="lp-mobile-nav"
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
          id="lp-mobile-nav"
          className={`lp-mobile-nav ${navOpen ? 'is-open' : ''}`}
          hidden={!navOpen}
        >
          <div className="lp-mobile-nav__lang">
            <LanguageSwitch />
          </div>
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.services')}
          </a>
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.process')}
          </a>
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.reviews')}
          </a>
          <Link to="/live-account" onClick={() => setNavOpen(false)}>
            {t('nav.liveAccount')}
          </Link>
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            {t('nav.freeAnalysis')}
          </a>
        </div>
      </header>

      <main id="top">
        <HeroBanner formSectionId={FORM_SECTION_ID} />
        <MostTradedSpreadBanner formSectionId={FORM_SECTION_ID} />

        <section className="lp-stats" aria-label={t('stats.aria')}>
          <div className="lp-container lp-stats-grid">
            <div>
              <span className="lp-stat-value">10K+</span>
              <span className="lp-stat-label">{t('stats.happyInvestors')}</span>
            </div>
            <div>
              <span className="lp-stat-value">%87</span>
              <span className="lp-stat-label">{t('stats.satisfaction')}</span>
            </div>
            <div>
              <span className="lp-stat-value">5+</span>
              <span className="lp-stat-label">{t('stats.yearsExp')}</span>
            </div>
            <div>
              <span className="lp-stat-value">₺50M+</span>
              <span className="lp-stat-label">{t('stats.portfolioVol')}</span>
            </div>
          </div>
        </section>

        <PaymentMethodsBanner />

        <TickerBanner />

        <BrokerFeaturesSection />

        <GlobalAwardsBanner />

        <section id="hizmetler" className="lp-section">
          <div className="lp-container">
            <header className="lp-section-head">
              <h2>{t('services.title')}</h2>
              <p className="lp-preline">{t('services.intro')}</p>
            </header>
            <div className="lp-cards lp-cards--three">
              <article className="lp-card">
                <IconShield />
                <h3>{t('services.card1Title')}</h3>
                <p className="lp-preline">{t('services.card1Body')}</p>
              </article>
              <article className="lp-card">
                <IconChart />
                <h3>{t('services.card2Title')}</h3>
                <p className="lp-preline">{t('services.card2Body')}</p>
              </article>
              <article className="lp-card">
                <IconGlobe />
                <h3>{t('services.card3Title')}</h3>
                <p className="lp-preline">{t('services.card3Body')}</p>
              </article>
            </div>
          </div>
        </section>

        <section id="surec" className="lp-section lp-section-alt">
          <div className="lp-container">
            <header className="lp-section-head">
              <h2>{t('process.title')}</h2>
              <p className="lp-preline">{t('process.intro')}</p>
            </header>
            <ol className="lp-steps">
              <li>
                <span className="lp-step-num">01</span>
                <strong>{t('process.step1Title')}</strong>
                <span className="lp-preline">{t('process.step1Body')}</span>
              </li>
              <li>
                <span className="lp-step-num">02</span>
                <strong>{t('process.step2Title')}</strong>
                <span className="lp-preline">{t('process.step2Body')}</span>
              </li>
              <li>
                <span className="lp-step-num">03</span>
                <strong>{t('process.step3Title')}</strong>
                <span className="lp-preline">{t('process.step3Body')}</span>
              </li>
              <li>
                <span className="lp-step-num">04</span>
                <strong>{t('process.step4Title')}</strong>
                <span className="lp-preline">{t('process.step4Body')}</span>
              </li>
            </ol>
          </div>
        </section>

        <section id="yorumlar" className="lp-section">
          <div className="lp-container">
            <header className="lp-section-head">
              <h2>{t('testimonials.title')}</h2>
              <p className="lp-preline">{t('testimonials.intro')}</p>
            </header>
            <div className="lp-testimonials">
              <figure className="lp-t-card">
                <blockquote className="lp-preline">{t('testimonials.q1')}</blockquote>
                <figcaption>
                  <span className="lp-t-name">{t('testimonials.name1')}</span>
                </figcaption>
              </figure>
              <figure className="lp-t-card">
                <blockquote className="lp-preline">{t('testimonials.q2')}</blockquote>
                <figcaption>
                  <span className="lp-t-name">{t('testimonials.name2')}</span>
                </figcaption>
              </figure>
            </div>
            <div className="lp-trust-note">
              <IconBolt />
              <p className="lp-preline">{t('testimonials.trust')}</p>
            </div>
          </div>
        </section>

        <section className="lp-cta lp-cta--extended">
          <div className="lp-container lp-cta-inner">
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.intro')}</p>
            <ul className="lp-benefits" aria-label={t('cta.benefitsAria')}>
              <li>
                <strong>{t('cta.b1Title')}</strong>
                <span>{t('cta.b1Text')}</span>
              </li>
              <li>
                <strong>{t('cta.b2Title')}</strong>
                <span>{t('cta.b2Text')}</span>
              </li>
              <li>
                <strong>{t('cta.b3Title')}</strong>
                <span>{t('cta.b3Text')}</span>
              </li>
              <li>
                <strong>{t('cta.b4Title')}</strong>
                <span>{t('cta.b4Text')}</span>
              </li>
            </ul>
            <dl className="lp-analiz-meta">
              <div>
                <dt>{t('cta.formDuration')}</dt>
                <dd>{t('cta.formDurationVal')}</dd>
              </div>
              <div>
                <dt>{t('cta.response')}</dt>
                <dd>{t('cta.responseVal')}</dd>
              </div>
            </dl>
            <div
              id={FORM_SECTION_ID}
              className="lp-form-scroll-anchor"
              tabIndex={-1}
              aria-hidden="true"
            />
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="lp-footer" id="gizlilik">
        <div className="lp-container lp-footer-grid">
          <div>
            <span className="lp-footer-brand">Veltara Markets</span>
            <p className="lp-footer-tag">{t('footer.tagline')}</p>
          </div>
          <div className="lp-footer-links">
            <span className="lp-footer-col-title">{t('footer.colCompany')}</span>
            <a href={`#${FORM_SECTION_ID}`}>{t('footer.about')}</a>
            <Link to="/live-account">{t('nav.liveAccount')}</Link>
            <a href={`#${FORM_SECTION_ID}`}>{t('nav.freeAnalysis')}</a>
            <a href={`#${FORM_SECTION_ID}`}>{t('footer.references')}</a>
          </div>
          <div className="lp-footer-links">
            <span className="lp-footer-col-title">{t('footer.colLegal')}</span>
            <a href={`#${FORM_SECTION_ID}`}>{t('footer.terms')}</a>
            <a href={`#${FORM_SECTION_ID}`}>{t('footer.privacy')}</a>
            <a href={`#${FORM_SECTION_ID}`}>{t('footer.cookies')}</a>
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
