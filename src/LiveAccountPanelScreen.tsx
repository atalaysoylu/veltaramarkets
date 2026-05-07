import { Link } from 'react-router-dom'
import { setDepositDraft } from './authStorage'
import { useAuth } from './AuthContext'
import { formatTemplate, useI18n } from './i18n/I18nProvider'

export default function LiveAccountPanelScreen() {
  const { user, logout } = useAuth()
  const { t } = useI18n()

  if (!user) return null

  return (
    <div className="lp-portal-outer lp-container">
      <div className="lp-portal-card lp-portal-panel">
        <p className="lp-portal-welcome">{formatTemplate(t('portal.welcome'), { name: user.fullName })}</p>
        <p className="lp-portal-lead">{t('portal.lead')}</p>
        <div className="lp-portal-actions-grid">
          <Link
            className="lp-portal-action lp-portal-action--deposit"
            to="/live-account/deposit"
            onClick={() => setDepositDraft(null)}
          >
            <span className="lp-portal-action-title">{t('portal.depositCta')}</span>
            <span className="lp-portal-action-sub">{t('portal.depositSub')}</span>
          </Link>
          <Link className="lp-portal-action lp-portal-action--withdraw" to="/live-account/withdraw">
            <span className="lp-portal-action-title">{t('portal.withdrawCta')}</span>
            <span className="lp-portal-action-sub">{t('portal.withdrawSub')}</span>
          </Link>
        </div>
        <button type="button" className="lp-portal-logout lp-btn lp-btn-ghost" onClick={logout}>
          {t('portal.logout')}
        </button>
      </div>
    </div>
  )
}
