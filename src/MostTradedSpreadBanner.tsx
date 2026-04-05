import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import { SymbolIcon, type MarketIconType, type MarketProductKey } from './MarketSymbolIcon'
import './MostTradedSpreadBanner.css'

type TabKey =
  | 'mostTraded'
  | 'commodities'
  | 'indices'
  | 'forex'
  | 'etf'
  | 'metals'
  | 'stocks'

type SpreadRow = {
  symbol: string
  spread: string
  productKey: MarketProductKey
  icon: MarketIconType
}

const TOP_TRADED_ORDER = [
  'XAUUSD',
  'USOUSD',
  'NVIDIA',
  'EURUSD',
  'NAS100',
  'EUB10Y',
  'ESGV',
] as const

const SPREAD_ROWS: SpreadRow[] = [
  { symbol: 'XAUUSD', spread: '1.3', productKey: 'metals', icon: 'metal' },
  { symbol: 'USOUSD', spread: '2.0', productKey: 'commodities', icon: 'commodity' },
  { symbol: 'WTI', spread: '2.1', productKey: 'commodities', icon: 'commodity' },
  { symbol: 'NVIDIA', spread: '0.9', productKey: 'stocks', icon: 'stock' },
  { symbol: 'EURUSD', spread: '0.1', productKey: 'forex', icon: 'forex' },
  { symbol: 'NAS100', spread: '39.5', productKey: 'indices', icon: 'index' },
  { symbol: 'EUB10Y', spread: '0.4', productKey: 'bonds', icon: 'bond' },
  { symbol: 'ESGV', spread: '0.3', productKey: 'etf', icon: 'etf' },
  { symbol: 'SPY', spread: '0.04', productKey: 'etf', icon: 'etf' },
]

const TABS: TabKey[] = [
  'mostTraded',
  'commodities',
  'indices',
  'forex',
  'etf',
  'metals',
  'stocks',
]

type Props = { formSectionId: string }

function NavIconMostTraded({ active }: { active: boolean }) {
  const stroke = active ? '#0b0e3d' : '#fff'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 19V5M5 19h14M8 17V11m4 6v-4m4 4V9"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NavIconCommodity() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="14" rx="6" ry="3.5" fill="currentColor" opacity={0.35} />
      <path
        d="M9 9c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

function NavIconIndex() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18V8l3 3 3-5 3 4 3-2v10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NavIconForex() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="12" r="4.5" fill="currentColor" opacity={0.4} />
      <circle cx="15" cy="12" r="4.5" fill="currentColor" opacity={0.85} />
    </svg>
  )
}

function NavIconEtf() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function NavIconMetal() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="10" width="4" height="8" rx="0.5" fill="currentColor" opacity={0.5} />
      <rect x="11" y="7" width="4" height="11" rx="0.5" fill="currentColor" opacity={0.75} />
      <rect x="16" y="12" width="3" height="6" rx="0.5" fill="currentColor" />
    </svg>
  )
}

function NavIconStock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4h8v16H8V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 14V9l2 2 2-3v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  if (tab === 'mostTraded') return <NavIconMostTraded active={active} />
  if (tab === 'commodities') return <NavIconCommodity />
  if (tab === 'indices') return <NavIconIndex />
  if (tab === 'forex') return <NavIconForex />
  if (tab === 'etf') return <NavIconEtf />
  if (tab === 'metals') return <NavIconMetal />
  return <NavIconStock />
}

function filterRows(tab: TabKey): SpreadRow[] {
  if (tab === 'mostTraded') {
    const bySymbol = new Map(SPREAD_ROWS.map((r) => [r.symbol, r]))
    return TOP_TRADED_ORDER.map((s) => bySymbol.get(s)).filter(Boolean) as SpreadRow[]
  }
  const keyMap: Record<Exclude<TabKey, 'mostTraded'>, MarketProductKey> = {
    commodities: 'commodities',
    indices: 'indices',
    forex: 'forex',
    etf: 'etf',
    metals: 'metals',
    stocks: 'stocks',
  }
  const pk = keyMap[tab]
  return SPREAD_ROWS.filter((r) => r.productKey === pk)
}

export function MostTradedSpreadBanner({ formSectionId }: Props) {
  const { t } = useI18n()
  const [tab, setTab] = useState<TabKey>('mostTraded')

  const rows = useMemo(() => filterRows(tab), [tab])

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

  const panelTitle = t(`topTraded.nav.${tab}`)

  return (
    <section className="lp-top-traded" aria-labelledby="lp-top-traded-title">
      <div className="lp-top-traded__inner">
        <h2 id="lp-top-traded-title" className="lp-top-traded__section-title">
          {t('topTraded.sectionTitle')}
        </h2>
        <p className="lp-top-traded__section-sub lp-preline">{t('topTraded.sectionSubtitle')}</p>

        <div className="lp-top-traded__card">
          <nav className="lp-top-traded__nav" aria-label={t('topTraded.navAria')}>
            {TABS.map((key) => {
              const active = tab === key
              return (
                <button
                  key={key}
                  type="button"
                  className={`lp-top-traded__nav-item${active ? ' is-active' : ''}`}
                  onClick={() => setTab(key)}
                  aria-pressed={active}
                >
                  <span className="lp-top-traded__nav-icon" aria-hidden>
                    <TabIcon tab={key} active={active} />
                  </span>
                  <span className="lp-top-traded__nav-label">{t(`topTraded.nav.${key}`)}</span>
                </button>
              )
            })}
          </nav>

          <div className="lp-top-traded__panel">
            <h3 className="lp-top-traded__panel-title">{panelTitle}</h3>

            <div className="lp-top-traded__scroll">
              <table className="lp-top-traded__table">
                <thead>
                  <tr>
                    <th scope="col">{t('topTraded.colSymbol')}</th>
                    <th scope="col" className="lp-top-traded__th-spread">
                      {t('topTraded.colSpread')}
                    </th>
                    <th scope="col" className="lp-top-traded__th-product">
                      {t('topTraded.colProduct')}
                    </th>
                    <th scope="col">
                      <span className="sr-only">{t('topTraded.colDetailSr')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.symbol}
                      className="lp-top-traded__row"
                      role="link"
                      tabIndex={0}
                      onClick={goForm}
                      onKeyDown={onRowKeyDown}
                      aria-label={formatTemplate(t('topTraded.rowAria'), {
                        symbol: row.symbol,
                      })}
                    >
                      <td>
                        <span className="lp-top-traded__symbol-cell">
                          <span className="lp-top-traded__icon">
                            <SymbolIcon type={row.icon} />
                          </span>
                          <span className="lp-top-traded__symbol-text">{row.symbol}</span>
                        </span>
                      </td>
                      <td className="lp-top-traded__spread">{row.spread}</td>
                      <td className="lp-top-traded__product">
                        {t(`markets.category.${row.productKey}`)}
                      </td>
                      <td>
                        <span className="lp-top-traded__arrow" aria-hidden>
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

            <p className="lp-top-traded__foot lp-preline">{t('topTraded.foot')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
