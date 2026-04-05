import { useI18n } from './i18n/I18nProvider'
import './BrokerFeaturesSection.css'

export function BrokerFeaturesSection() {
  const { t, messages } = useI18n()
  const items = messages.brokerFeats.items

  return (
    <section
      id="avantajlar"
      className="lp-broker-feats"
      aria-label={t('brokerFeats.aria')}
    >
      <div className="lp-container lp-broker-feats__inner">
        <ul className="lp-broker-feats__list">
          {items.map((item, i) => (
            <li key={i} className="lp-broker-feats__block">
              <h2 className="lp-broker-feats__title">{item.title}</h2>
              <p className="lp-broker-feats__body lp-preline">{item.body}</p>
              {'note' in item && item.note ? (
                <p className="lp-broker-feats__note lp-preline">{item.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
