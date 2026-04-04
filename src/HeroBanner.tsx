import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import './HeroBanner.css'

const SLIDE_LAYOUT = [
  {
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80',
    chartVariant: 0 as const,
  },
  {
    image:
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1920&q=80',
    chartVariant: 1 as const,
  },
  {
    meshOnly: true,
    chartVariant: 2 as const,
  },
] as const

const AUTO_MS = 6500

function HeroChart({
  variant,
  gradId,
}: {
  variant: 0 | 1 | 2
  gradId: string
}) {
  const paths: Record<0 | 1 | 2, string> = {
    0: 'M0 85 L40 72 L80 78 L120 45 L160 52 L200 28 L240 35 L280 18 L320 25 L360 8 L400 15',
    1: 'M0 60 L50 55 L100 70 L150 38 L200 48 L250 22 L300 30 L350 12 L400 20',
    2: 'M0 75 L45 68 L90 82 L135 40 L180 55 L225 25 L270 38 L315 10 L360 22 L400 5',
  }
  const h = 100
  const w = 400
  const d = paths[variant]
  const ty = h * 0.08
  const fillD = `${d} L${w} ${h} L0 ${h} Z`

  return (
    <div className="lp-hero-banner__chart-wrap" aria-hidden>
      <svg
        className="lp-hero-banner__chart"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b6914" />
            <stop offset="40%" stopColor="#f4d98c" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>
        <g transform={`translate(0 ${ty})`}>
          <path d={fillD} fill={`url(#${gradId})`} opacity={0.14} />
          <path
            className="lp-hero-banner__chart-line"
            d={d}
            pathLength={1}
            stroke={`url(#${gradId})`}
            fill="none"
          />
        </g>
      </svg>
    </div>
  )
}

type HeroBannerProps = { formSectionId: string }

export function HeroBanner({ formSectionId }: HeroBannerProps) {
  const { t, messages } = useI18n()
  const slides = messages.hero.slides
  const n = slides.length

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useRef(
    typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const gradBase = useId().replace(/:/g, '')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback(
    (i: number) => {
      setActive(((i % n) + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (reduceMotion.current || paused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % n)
    }, AUTO_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, n])

  const href = `#${formSectionId}`
  const slide = slides[active]
  const layout = SLIDE_LAYOUT[active]

  return (
    <section
      className="lp-hero-banner"
      aria-roledescription="carousel"
      aria-label={t('hero.ariaCarousel')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="lp-hero-banner__slides">
        {SLIDE_LAYOUT.map((lay, i) => (
          <div
            key={i}
            className={`lp-hero-banner__slide ${i === active ? 'is-active' : ''} ${'meshOnly' in lay && lay.meshOnly ? 'lp-hero-banner__slide--mesh' : ''}`}
            aria-hidden={i !== active}
          >
            {'meshOnly' in lay && lay.meshOnly ? (
              <>
                <div className="lp-hero-banner__slide-bg lp-hero-banner__slide-bg--solid" />
                <div className="lp-hero-banner__mesh" />
              </>
            ) : (
              <div
                className="lp-hero-banner__slide-bg"
                style={{
                  backgroundImage:
                    'image' in lay && lay.image
                      ? `url(${lay.image})`
                      : undefined,
                }}
              />
            )}
            <div className="lp-hero-banner__slide-overlay" />
            <div className="lp-hero-banner__grid" />
          </div>
        ))}
      </div>

      <div className="lp-hero-banner__inner">
        <div className="lp-hero-banner__copy">
          <p className="lp-hero-banner__eyebrow">{slide.eyebrow}</p>
          <h1 className="lp-hero-banner__title">
            {slide.titleBefore}
            <em>{slide.titleEm}</em>
            {slide.titleAfter}
          </h1>
          <p className="lp-hero-banner__lead lp-preline">{slide.lead}</p>
          <div className="lp-hero-banner__stats">
            <div className="lp-hero-banner__stat">
              <span className="lp-hero-banner__stat-val">10K+</span>
              <span className="lp-hero-banner__stat-lbl">
                {t('hero.statInvestors')}
              </span>
            </div>
            <div className="lp-hero-banner__stat">
              <span className="lp-hero-banner__stat-val">5+</span>
              <span className="lp-hero-banner__stat-lbl">
                {t('hero.statYears')}
              </span>
            </div>
            <div className="lp-hero-banner__stat">
              <span className="lp-hero-banner__stat-val">24s</span>
              <span className="lp-hero-banner__stat-lbl">
                {t('hero.statReply')}
              </span>
            </div>
          </div>
          <div className="lp-hero-banner__cta">
            <a href={href} className="lp-btn-hb-primary">
              {t('hero.ctaPrimary')}
            </a>
            <a href={href} className="lp-btn-hb-ghost">
              {t('hero.ctaSecondary')}
            </a>
          </div>
          <div className="lp-hero-banner__trust">
            <span>{t('hero.trust1')}</span>
            <span>{t('hero.trust2')}</span>
            <span>{t('hero.trust3')}</span>
          </div>
        </div>
        <div className="lp-hero-banner__visual">
          <HeroChart
            key={active}
            variant={layout.chartVariant}
            gradId={`${gradBase}-stroke-${active}`}
          />
        </div>
      </div>

      <div className="lp-hero-banner__controls">
        <button
          type="button"
          className="lp-hero-banner__arrow"
          aria-label={t('hero.prevSlide')}
          onClick={() => go(active - 1)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          className="lp-hero-banner__dots"
          role="tablist"
          aria-label={t('hero.pickSlide')}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={formatTemplate(t('hero.slideN'), { n: i + 1 })}
              className={`lp-hero-banner__dot ${i === active ? 'is-current' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="lp-hero-banner__arrow"
          aria-label={t('hero.nextSlide')}
          onClick={() => go(active + 1)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {!reduceMotion.current ? (
          <span className="lp-hero-banner__pause" aria-hidden>
            {paused ? t('hero.paused') : ''}
          </span>
        ) : null}
      </div>
    </section>
  )
}
