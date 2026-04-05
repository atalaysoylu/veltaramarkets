import type { ReactNode } from 'react'

/** Tanıtım amaçlı stilize mini logolar (tescilli marka kopyası değildir). */
export function TickerLogo({ id }: { id: string }) {
  const cn = 'lp-ticker__logo-svg'
  const pill = (w: number, children: ReactNode) => (
    <svg className={cn} viewBox={`0 0 ${w} 32`} fill="none" aria-hidden>
      <rect x="1" y="3" width={w - 2} height="26" rx="6" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      {children}
    </svg>
  )

  switch (id) {
    case 'mt5':
      return (
        <svg className={cn} viewBox="0 0 52 34" fill="none" aria-hidden>
          <rect x="3" y="20" width="5" height="11" rx="1" fill="currentColor" />
          <rect x="11" y="14" width="5" height="17" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="19" y="8" width="5" height="23" rx="1" fill="currentColor" />
          <rect x="27" y="12" width="5" height="19" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="35" y="5" width="5" height="26" rx="1" fill="currentColor" />
          <text x="44" y="22" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="system-ui,sans-serif">
            5
          </text>
        </svg>
      )
    case 'mt4':
      return (
        <svg className={cn} viewBox="0 0 52 34" fill="none" aria-hidden>
          <rect x="4" y="20" width="6" height="11" rx="1" fill="currentColor" />
          <rect x="14" y="12" width="6" height="19" rx="1" fill="currentColor" />
          <rect x="24" y="16" width="6" height="15" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="34" y="7" width="6" height="24" rx="1" fill="currentColor" />
          <text x="44" y="22" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="system-ui,sans-serif">
            4
          </text>
        </svg>
      )
    case 'nasdaq':
      return pill(
        76,
        <text
          x="38"
          y="21"
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="currentColor"
          fontFamily="system-ui,Segoe UI,sans-serif"
          letterSpacing="0.1em"
        >
          NASDAQ
        </text>,
      )
    case 'dax':
      return pill(
        52,
        <text
          x="26"
          y="21"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill="currentColor"
          fontFamily="system-ui,sans-serif"
          letterSpacing="0.12em"
        >
          DAX
        </text>,
      )
    case 'bist':
      return pill(
        54,
        <text
          x="27"
          y="21"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="currentColor"
          fontFamily="system-ui,sans-serif"
          letterSpacing="0.14em"
        >
          BIST
        </text>,
      )
    case 'nyse':
      return pill(
        56,
        <text
          x="28"
          y="21"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="currentColor"
          fontFamily="system-ui,sans-serif"
          letterSpacing="0.1em"
        >
          NYSE
        </text>,
      )
    case 'sp500':
      return (
        <svg className={cn} viewBox="0 0 72 32" fill="none" aria-hidden>
          <rect x="1" y="3" width="70" height="26" rx="6" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
          <text x="36" y="21" textAnchor="middle" fontSize="13" fontWeight="800" fill="currentColor" fontFamily="system-ui,sans-serif">
            S&P 500
          </text>
        </svg>
      )
    case 'forex':
      return (
        <svg className={cn} viewBox="0 0 56 32" fill="none" aria-hidden>
          <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="40" cy="16" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M25 16h10M29 12l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'xauusd':
      return (
        <svg className={cn} viewBox="0 0 88 32" fill="none" aria-hidden>
          <circle cx="15" cy="16" r="10" stroke="currentColor" strokeWidth="1.6" />
          <text x="15" y="20" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor" fontFamily="system-ui,sans-serif">
            Au
          </text>
          <text x="34" y="20" fontSize="12" fontWeight="700" fill="currentColor" opacity="0.75" fontFamily="system-ui,sans-serif">
            /
          </text>
          <text x="44" y="20" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="system-ui,sans-serif">
            USD
          </text>
        </svg>
      )
    case 'eurostoxx':
      return (
        <svg className={cn} viewBox="0 0 120 32" fill="none" aria-hidden>
          <rect x="1" y="3" width="118" height="26" rx="6" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
          <text
            x="60"
            y="21"
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill="currentColor"
            fontFamily="system-ui,sans-serif"
            letterSpacing="0.06em"
          >
            EURO STOXX 50
          </text>
        </svg>
      )
    default:
      return (
        <svg className={cn} viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.75" fill="none" />
        </svg>
      )
  }
}
