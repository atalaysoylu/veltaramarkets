import { useI18n } from './i18n/I18nProvider'
import { TickerLogo } from './TickerBannerLogos'
import './TickerBanner.css'

export const TICKER_ENTRIES = [
  { id: 'mt5', label: 'MT5', showTextLabel: true },
  { id: 'mt4', label: 'MT4', showTextLabel: true },
  { id: 'nasdaq', label: 'NASDAQ', showTextLabel: false },
  { id: 'dax', label: 'DAX', showTextLabel: false },
  { id: 'bist', label: 'BIST', showTextLabel: false },
  { id: 'nyse', label: 'NYSE', showTextLabel: false },
  { id: 'sp500', label: 'S&P 500', showTextLabel: false },
  { id: 'forex', label: 'FOREX', showTextLabel: true },
  { id: 'xauusd', label: 'XAU/USD', showTextLabel: true },
  { id: 'eurostoxx', label: 'EURO STOXX 50', showTextLabel: false },
] as const

function TickerGroup({ groupId }: { groupId: string }) {
  return (
    <div className="lp-ticker__group">
      {TICKER_ENTRIES.map((entry, i) => (
        <span key={`${groupId}-${i}`} className="lp-ticker__cell">
          <span className="lp-ticker__chip" aria-label={entry.label}>
            <span className="lp-ticker__logo" aria-hidden>
              <TickerLogo id={entry.id} />
            </span>
            {entry.showTextLabel ? (
              <span className="lp-ticker__label">{entry.label}</span>
            ) : null}
          </span>
          <span className="lp-ticker__dot" aria-hidden>
            ·
          </span>
        </span>
      ))}
    </div>
  )
}

export function TickerBanner() {
  const { t } = useI18n()

  return (
    <section className="lp-ticker" aria-label={t('ticker.aria')} role="region">
      <div className="lp-ticker__viewport" aria-hidden="true">
        <div className="lp-ticker__track">
          <TickerGroup groupId="a" />
          <TickerGroup groupId="b" />
        </div>
      </div>
    </section>
  )
}
