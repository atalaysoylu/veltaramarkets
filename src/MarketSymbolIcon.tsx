export type MarketProductKey =
  | 'metals'
  | 'stocks'
  | 'forex'
  | 'indices'
  | 'commodities'
  | 'bonds'
  | 'etf'

export type MarketIconType =
  | 'metal'
  | 'stock'
  | 'forex'
  | 'index'
  | 'commodity'
  | 'bond'
  | 'etf'

export function SymbolIcon({ type }: { type: MarketIconType }) {
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
            stroke="#0d6efd"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M9 12h6M12 9v6"
            stroke="#0d6efd"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    default:
      return null
  }
}
