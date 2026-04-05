import { useI18n } from './i18n/I18nProvider'
import './GlobalAwardsBanner.css'

function LaurelBranch({ mirror }: { mirror?: boolean }) {
  return (
    <svg
      className="lp-global-awards__laurel"
      viewBox="0 0 34 108"
      fill="none"
      aria-hidden
      style={mirror ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3 C5 24 3 46 8 66 C10 76 13 86 17 96" />
        <path d="M9 16c5-3 8 1 5 7M7 32c6-2 9 4 5 9M9 48c6 0 10 6 6 11M11 64c7 1 11 9 7 14" />
        <path d="M25 20c-5-3-8 1-5 7M27 36c-6-2-9 4-5 9M25 52c-6 0-10 6-6 11M25 68c-7 1-11 9-6 14" />
      </g>
    </svg>
  )
}

type AwardItem = {
  lines: readonly string[]
  year: string
}

function AwardBadge({
  item,
  featured,
}: {
  item: AwardItem
  featured: boolean
}) {
  return (
    <div
      className={`lp-global-awards__badge ${featured ? 'lp-global-awards__badge--featured' : ''}`}
    >
      <LaurelBranch />
      <div className="lp-global-awards__badge-core">
        {item.lines.map((line) => (
          <span key={line} className="lp-global-awards__badge-line">
            {line}
          </span>
        ))}
        <span className="lp-global-awards__badge-year">{item.year}</span>
      </div>
      <LaurelBranch mirror />
    </div>
  )
}

export function GlobalAwardsBanner() {
  const { messages } = useI18n()
  const ga = messages.globalAwards
  const featuredIndex = 2

  return (
    <section
      className="lp-global-awards"
      aria-label={ga.aria}
    >
      <div className="lp-container lp-global-awards__inner">
        <h2 className="lp-global-awards__heading">
          <span className="lp-global-awards__heading-cyan">{ga.headingCyan}</span>{' '}
          <span className="lp-global-awards__heading-navy">{ga.headingNavy}</span>
        </h2>

        <ul className="lp-global-awards__grid">
          {ga.items.map((item, i) => (
            <li key={i} className="lp-global-awards__cell">
              <AwardBadge item={item} featured={i === featuredIndex} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
