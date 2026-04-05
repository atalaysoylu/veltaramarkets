import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { formatTemplate, useI18n } from './i18n/I18nProvider'
import './HeroBanner.css'

/** Borsa, ekonomi ve kurumsal finans temalı hero görselleri */
const SLIDE_IMAGES = [
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2400&q=88',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=88',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=88',
] as const

const AUTO_MS = 6500

function IconUsers() {
  return (
    <svg className="lp-hero-banner__feat-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg className="lp-hero-banner__feat-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg className="lp-hero-banner__feat-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg className="lp-hero-banner__feat-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M12 3a14 14 0 0 0 0 18M12 3a14 14 0 0 1 0 18"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  )
}

type HeroBannerProps = { formSectionId: string }

export function HeroBanner({ formSectionId }: HeroBannerProps) {
  const { t, messages } = useI18n()
  const slides = messages.hero.slides
  const n = slides.length

  const [active, setActive] = useState(0)
  const reduceMotion = useRef(
    typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback(
    (i: number) => {
      setActive(((i % n) + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (reduceMotion.current) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % n)
    }, AUTO_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [n])

  const href = `#${formSectionId}`
  const slide = slides[active]

  const features = [
    { Icon: IconUsers, num: t('hero.feat1Num'), lbl: t('hero.feat1Lbl') },
    { Icon: IconLayers, num: t('hero.feat2Num'), lbl: t('hero.feat2Lbl') },
    { Icon: IconDoc, num: t('hero.feat3Num'), lbl: t('hero.feat3Lbl') },
    { Icon: IconGlobe, num: t('hero.feat4Num'), lbl: t('hero.feat4Lbl') },
  ] as const

  return (
    <section
      className="lp-hero-banner lp-hero-banner--split"
      aria-roledescription="carousel"
      aria-label={t('hero.ariaCarousel')}
    >
      <div className="lp-hero-banner__media" aria-hidden>
        {SLIDE_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`lp-hero-banner__media-img ${i === active ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="lp-hero-banner__scrim" aria-hidden />

      <div className="lp-hero-banner__shell">
        <div className="lp-hero-banner__main">
          <div className="lp-hero-banner__grid">
            <div className="lp-hero-banner__copy">
              <h1 className="lp-hero-banner__title">
                <span className="lp-hero-banner__title-line">
                  <span className="lp-hero-banner__title-white">
                    {t('hero.headlineBefore')}
                  </span>
                  <span className="lp-hero-banner__title-blue">
                    {t('hero.headlineBlue')}
                  </span>
                </span>
              </h1>
              <p className="lp-hero-banner__lead lp-preline">{slide.lead}</p>
              <div className="lp-hero-banner__cta-row">
                <a href={href} className="lp-hero-banner__btn-blue">
                  {t('hero.ctaJoin')}
                </a>
              </div>
              <a href={href} className="lp-hero-banner__text-link">
                {t('hero.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>

        <div className="lp-hero-banner__side-nav">
          <button
            type="button"
            className="lp-hero-banner__side-arrow"
            aria-label={t('hero.prevSlide')}
            onClick={() => go(active - 1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="lp-hero-banner__side-arrow"
            aria-label={t('hero.nextSlide')}
            onClick={() => go(active + 1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="lp-hero-banner__bottom-bar">
        <div className="lp-hero-banner__features-inner">
          <div className="lp-hero-banner__features" role="list">
            {features.map(({ Icon, num, lbl }, i) => (
              <div key={i} className="lp-hero-banner__feat" role="listitem">
                <Icon />
                <div className="lp-hero-banner__feat-text">
                  <span className="lp-hero-banner__feat-num">{num}</span>
                  <span className="lp-hero-banner__feat-lbl">{lbl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-hero-banner__dots-row">
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
        </div>
      </div>
    </section>
  )
}
