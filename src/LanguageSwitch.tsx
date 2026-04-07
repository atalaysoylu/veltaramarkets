import { useI18n } from './i18n/I18nProvider'

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n()
  return (
    <div
      className="lp-lang"
      role="group"
      aria-label={t('lang.switch')}
    >
      <button
        type="button"
        className={locale === 'tr' ? 'is-active' : ''}
        onClick={() => setLocale('tr')}
        aria-pressed={locale === 'tr'}
      >
        {t('lang.tr')}
      </button>
      <button
        type="button"
        className={locale === 'en' ? 'is-active' : ''}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}
