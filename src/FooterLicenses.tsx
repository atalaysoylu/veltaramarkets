import { useI18n } from './i18n/I18nProvider'

/** Sıra: soldan sağa footer şeridinde gösterim */
const LICENSE_ORDER = [
  'fca',
  'cysec',
  'asic',
  'finma',
  'nasdaq',
  'bist',
] as const

/** `cysec` dosya adı bazı ağ filtrelerinde yanlışlıkla engellenebiliyor; ayrı asset kullan */
const LICENSE_FILENAME: Partial<Record<(typeof LICENSE_ORDER)[number], string>> = {
  cysec: 'cyprus-commission',
}

export function FooterLicenses() {
  const { messages } = useI18n()
  const { licenses } = messages.footer

  return (
    <div className="lp-footer-licenses">
      <p className="lp-footer-licenses__title">{licenses.title}</p>
      <ul
        className="lp-footer-licenses__list"
        aria-label={licenses.aria}
      >
        {LICENSE_ORDER.map((id) => {
          const item = licenses.items.find((x) => x.id === id)
          if (!item) return null
          const file = LICENSE_FILENAME[id] ?? id
          return (
            <li key={id} className="lp-footer-licenses__item">
              <div className="lp-footer-licenses__logo-wrap">
                <img
                  src={`/licenses/${file}.svg`}
                  alt={item.alt}
                  width={200}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="lp-footer-licenses__logo"
                />
              </div>
              <span className="lp-footer-licenses__caption" aria-hidden="true">
                {item.caption}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
