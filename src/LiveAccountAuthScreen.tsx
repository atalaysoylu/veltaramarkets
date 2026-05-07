import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useI18n } from './i18n/I18nProvider'
import { LiveAccountForm } from './LiveAccountForm'
import { LoginForm } from './LoginForm'
import './LiveAccountAuth.css'

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

export default function LiveAccountAuthScreen() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [tab, setTab] = useState<'login' | 'register'>('register')

  if (user) {
    return <Navigate to="/live-account/panel" replace />
  }

  return (
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

        <div className="lp-live-form-panel lp-auth-panel">
          <div className="lp-auth-tabs" role="tablist" aria-label={t('auth.tablistAria')}>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              className={`lp-auth-tab ${tab === 'register' ? 'is-active' : ''}`}
              onClick={() => setTab('register')}
            >
              {t('auth.tabRegister')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              className={`lp-auth-tab ${tab === 'login' ? 'is-active' : ''}`}
              onClick={() => setTab('login')}
            >
              {t('auth.tabLogin')}
            </button>
          </div>
          <h1 className="lp-live-form-title">
            {tab === 'login' ? (
              t('auth.loginHeading')
            ) : (
              <>
                {t('liveAccount.formTitleBefore')}
                <span className="lp-live-form-title-accent">{t('liveAccount.formTitleAccent')}</span>
              </>
            )}
          </h1>
          {tab === 'login' ? <LoginForm /> : <LiveAccountForm />}
          <p className="lp-auth-back">
            <Link to="/">{t('liveAccount.backHome')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
