import { useCallback, type KeyboardEvent } from 'react'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import './MarketsProductsSection.css'

type ChangeDir = 'up' | 'down' | 'flat'

type ProductKey =
  | 'metals'
  | 'stocks'
  | 'forex'
  | 'indices'
  | 'commodities'
  | 'bonds'
  | 'etf'

type MarketRow = {
  symbol: string
  spread: string
  sell: string
  buy: string
  change: string
  changeDir: ChangeDir
  productKey: ProductKey
  icon: 'metal' | 'stock' | 'forex' | 'index' | 'commodity' | 'bond' | 'etf'
}

const ROWS: MarketRow[] = [
  {
    symbol: 'XAUUSD',
    spread: '1.3',
    sell: '4675.72',
    buy: '4675.85',
    change: '0.00%',
    changeDir: 'flat',
    productKey: 'metals',
    icon: 'metal',
  },
  {
    symbol: 'NVIDIA',
    spread: '0.9',
    sell: '177.27',
    buy: '177.36',
    change: '0.05%',
    changeDir: 'up',
    productKey: 'stocks',
    icon: 'stock',
  },
  {
    symbol: 'EURUSD',
    spread: '0.1',
    sell: '1.15106',
    buy: '1.15254',
    change: '0.13%',
    changeDir: 'up',
    productKey: 'forex',
    icon: 'forex',
  },
  {
    symbol: 'NAS100',
    spread: '39.5',
    sell: '23972.55',
    buy: '23976.50',
    change: '0.02%',
    changeDir: 'up',
    productKey: 'indices',
    icon: 'index',
  },
  {
    symbol: 'WTI',
    spread: '2.1',
    sell: '71.42',
    buy: '71.48',
    change: '-0.08%',
    changeDir: 'down',
    productKey: 'commodities',
    icon: 'commodity',
  },
  {
    symbol: 'US10Y',
    spread: '0.02',
    sell: '4.285',
    buy: '4.302',
    change: '0.01%',
    changeDir: 'up',
    productKey: 'bonds',
    icon: 'bond',
  },
  {
    symbol: 'SPY',
    spread: '0.04',
    sell: '598.12',
    buy: '598.18',
    change: '0.03%',
    changeDir: 'up',
    productKey: 'etf',
    icon: 'etf',
  },
]

function SymbolIcon({ type }: { type: MarketRow['icon'] }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24' as const }
  switch (type) {
    case 'metal':
      return (
        <svg {...common} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" fill="#b45309" opacity={0.35} />
          <circle cx="12" cy="12" r="5" fill="#fbbf24" />
        </svg>
      )
    case 'stock':
      return (
        <svg {...common} fill="none" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="3" fill="#16a34a" />
          <path
            d="M8 15V9l3 3 2.5-2.5L16 12"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'forex':
      return (
        <svg {...common} fill="none" aria-hidden>
          <circle cx="9.5" cy="12" r="5.5" fill="#1d4ed8" opacity={0.9} />
          <circle cx="14.5" cy="12" r="5.5" fill="#e5e5e5" opacity={0.85} />
        </svg>
      )
    case 'index':
      return (
        <svg {...common} fill="none" aria-hidden>
          <path
            d="M4 18V6l4 4 4-6 4 5 4-3v12"
            stroke="#a78bfa"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'commodity':
      return (
        <svg {...common} fill="none" aria-hidden>
          <ellipse cx="12" cy="14" rx="7" ry="4" fill="#57534e" />
          <path
            d="M8 10c0-2 2-4 4-4s4 2 4 4"
            stroke="#d6d3d1"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )
    case 'bond':
      return (
        <svg {...common} fill="none" aria-hidden>
          <rect
            x="6"
            y="5"
            width="12"
            height="14"
            rx="1"
            stroke="#94a3b8"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M9 9h6M9 12h6M9 15h4"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'etf':
      return (
        <svg {...common} fill="none" aria-hidden>
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            rx="2"
            stroke="#d4af37"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M9 12h6M12 9v6"
            stroke="#d4af37"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    default:
      return null
  }
}

type Props = { formSectionId: string }

export function MarketsProductsSection({ formSectionId }: Props) {
  const { t } = useI18n()

  const goForm = useCallback(() => {
    window.location.hash = formSectionId
  }, [formSectionId])

  const onRowKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        goForm()
      }
    },
    [goForm],
  )

  return (
    <section className="lp-markets" aria-labelledby="lp-markets-title">
      <div className="lp-markets__inner">
        <header className="lp-markets__head">
          <h2 id="lp-markets-title" className="lp-markets__title">
            {t('markets.title')}
          </h2>
          <p className="lp-markets__subtitle lp-preline">
            {t('markets.subtitleBefore')}
            <strong>Veltara Markets</strong>
            {t('markets.subtitleAfter')}
          </p>
        </header>

        <div className="lp-markets__scroll">
          <table className="lp-markets__table">
            <thead>
              <tr>
                <th scope="col">{t('markets.colSymbol')}</th>
                <th scope="col">{t('markets.colSpread')}</th>
                <th scope="col">{t('markets.colSell')}</th>
                <th scope="col">{t('markets.colBuy')}</th>
                <th scope="col">{t('markets.colChange')}</th>
                <th scope="col">{t('markets.colProduct')}</th>
                <th scope="col">
                  <span className="sr-only">{t('markets.colDetailSr')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.symbol}
                  className="lp-markets__row"
                  role="link"
                  tabIndex={0}
                  onClick={goForm}
                  onKeyDown={onRowKeyDown}
                  aria-label={formatTemplate(t('markets.rowAria'), {
                    symbol: row.symbol,
                  })}
                >
                  <td>
                    <span className="lp-markets__symbol-cell">
                      <span className="lp-markets__icon">
                        <SymbolIcon type={row.icon} />
                      </span>
                      <span className="lp-markets__symbol-text">{row.symbol}</span>
                    </span>
                  </td>
                  <td className="lp-markets__muted">{row.spread}</td>
                  <td>{row.sell}</td>
                  <td>{row.buy}</td>
                  <td
                    className={
                      row.changeDir === 'up'
                        ? 'lp-markets__change--up'
                        : row.changeDir === 'down'
                          ? 'lp-markets__change--down'
                          : 'lp-markets__change--flat'
                    }
                  >
                    {row.change}
                  </td>
                  <td className="lp-markets__muted">
                    {t(`markets.category.${row.productKey}`)}
                  </td>
                  <td>
                    <span className="lp-markets__arrow" aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="lp-markets__foot lp-preline">{t('markets.foot')}</p>
      </div>
    </section>
  )
}
