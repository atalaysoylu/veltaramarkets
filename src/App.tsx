import { useState } from 'react'
import { ContactForm } from './ContactForm'
import './App.css'

const FORM_SECTION_ID = 'analiz'

function IconChart() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 17V9m4 8v-5m4 5v-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconShield() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg className="lp-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M12 3a14 14 0 0 0 0 18M12 3a14 14 0 0 1 0 18"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="lp-menu-svg">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="lp-menu-svg">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="landing">
      <header className="lp-header">
        <div className="lp-header-inner">
          <a href={`#${FORM_SECTION_ID}`} className="lp-logo">
            <span className="lp-logo-mark" aria-hidden />
            <span className="lp-logo-text">Meridian Trade</span>
          </a>
          <div className="lp-header-end">
            <nav className="lp-nav" aria-label="Ana menü">
              <a href={`#${FORM_SECTION_ID}`}>Hizmetler</a>
              <a href={`#${FORM_SECTION_ID}`}>Süreç</a>
              <a href={`#${FORM_SECTION_ID}`}>Yorumlar</a>
              <a href={`#${FORM_SECTION_ID}`}>Ücretsiz analiz</a>
            </nav>
            <div className="lp-header-actions">
              <a href={`#${FORM_SECTION_ID}`} className="lp-btn lp-btn-ghost lp-btn-header">
                Daha fazla bilgi
              </a>
              <a href={`#${FORM_SECTION_ID}`} className="lp-btn lp-btn-primary lp-btn-header">
                Ücretsiz analiz
              </a>
              <button
                type="button"
                className="lp-nav-toggle"
                aria-expanded={navOpen}
                aria-controls="lp-mobile-nav"
                onClick={() => setNavOpen((o) => !o)}
              >
                {navOpen ? (
                  <>
                    <CloseIcon /> <span className="sr-only">Menüyü kapat</span>
                  </>
                ) : (
                  <>
                    <MenuIcon /> <span className="sr-only">Menüyü aç</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div
          id="lp-mobile-nav"
          className={`lp-mobile-nav ${navOpen ? 'is-open' : ''}`}
          hidden={!navOpen}
        >
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            Hizmetler
          </a>
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            Süreç
          </a>
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            Yorumlar
          </a>
          <a href={`#${FORM_SECTION_ID}`} onClick={() => setNavOpen(false)}>
            Ücretsiz analiz
          </a>
        </div>
      </header>

      <main id="top">
        <section className="lp-hero">
          <div className="lp-hero-grid" aria-hidden />
          <div className="lp-hero-glow" aria-hidden />
          <div className="lp-container lp-hero-inner">
            <p className="lp-eyebrow">Profesyonel yatırım danışmanlığı</p>
            <h1 className="lp-hero-title">
              Akıllı yatırımla geleceğinizi inşa edin
            </h1>
            <p className="lp-hero-lead">
              Finansal özgürlüğe giden yolda size rehberlik ediyoruz. Güvenli ve
              sürdürülebilir yatırım stratejileri için portföyünüzü birlikte
              şekillendirelim — risk profilinize uygun, şeffaf bir planla ilerleyin.
            </p>
            <div className="lp-hero-perf" role="group" aria-label="Örnek portföy göstergeleri">
              <div className="lp-perf-card">
                <span className="lp-perf-label">Örnek yıllık getiri*</span>
                <span className="lp-perf-value">+24,5%</span>
                <span className="lp-perf-hint">Portföy performansı</span>
              </div>
              <div className="lp-perf-card">
                <span className="lp-perf-label">Risk skoru hedefi</span>
                <span className="lp-perf-value lp-perf-value--muted">Düşük</span>
                <span className="lp-perf-hint">Profilize göre ayarlanır</span>
              </div>
            </div>
            <div className="lp-hero-cta">
              <a href={`#${FORM_SECTION_ID}`} className="lp-btn lp-btn-primary lp-btn-lg">
                Ücretsiz analiz al
              </a>
              <a href={`#${FORM_SECTION_ID}`} className="lp-btn lp-btn-outline-light lp-btn-lg">
                Hizmetleri keşfet
              </a>
            </div>
            <ul className="lp-hero-badges">
              <li>Kişiselleştirilmiş portföy önerileri</li>
              <li>Risk odaklı değerlendirme</li>
              <li>Güncel piyasa analizi</li>
            </ul>
            <p className="lp-hero-footnote">
              * Geçmiş performans gelecek getiriyi garanti etmez; örnek gösterge niteliğindedir.
            </p>
          </div>
        </section>

        <section className="lp-stats" aria-label="Öne çıkan rakamlar">
          <div className="lp-container lp-stats-grid">
            <div>
              <span className="lp-stat-value">10K+</span>
              <span className="lp-stat-label">Mutlu yatırımcı</span>
            </div>
            <div>
              <span className="lp-stat-value">%87</span>
              <span className="lp-stat-label">Hedeflenen memnuniyet oranı**</span>
            </div>
            <div>
              <span className="lp-stat-value">5+</span>
              <span className="lp-stat-label">Yıllık deneyim</span>
            </div>
            <div>
              <span className="lp-stat-value">₺50M+</span>
              <span className="lp-stat-label">Yönetilen portföy hacmi***</span>
            </div>
          </div>
        </section>

        <section id="hizmetler" className="lp-section">
          <div className="lp-container">
            <header className="lp-section-head">
              <h2>Hizmetlerimiz</h2>
              <p>
                Profesyonel yatırım danışmanlığı ile finansal hedeflerinize
                ulaşmanız için portföyünüzü analiz eder, stratejinizi netleştiririz.
              </p>
            </header>
            <div className="lp-cards lp-cards--three">
              <article className="lp-card">
                <IconShield />
                <h3>Güvenli yatırım</h3>
                <p>
                  Risk analizleri ve senaryo çalışmaları ile size uygun, güvenli
                  yatırım stratejileri öneriyoruz.
                </p>
              </article>
              <article className="lp-card">
                <IconChart />
                <h3>Portföy analizi</h3>
                <p>
                  Varlık dağılımınızı ve getiri-risk dengenizi inceleyerek
                  kişiselleştirilmiş portföy optimizasyonu sunuyoruz.
                </p>
              </article>
              <article className="lp-card">
                <IconGlobe />
                <h3>Çeşitlendirme</h3>
                <p>
                  Dengeli risk dağılımı ile uzun vadeli hedeflerinize uygun,
                  çeşitlendirilmiş yapı kurmanıza yardımcı oluyoruz.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="surec" className="lp-section lp-section-alt">
          <div className="lp-container">
            <header className="lp-section-head">
              <h2>Ücretsiz yatırım analizi nasıl işler?</h2>
              <p>
                Bilgilerinizi paylaşın; size özel yatırım stratejinizi oluşturmak
                için kısa bir değerlendirme yapalım.
              </p>
            </header>
            <ol className="lp-steps">
              <li>
                <span className="lp-step-num">01</span>
                <strong>Form ve ön görüşme</strong>
                <span>
                  Yaklaşık 3 dakikada temel bilgilerinizi iletirsiniz; ekibimiz
                  24 saat içinde size döner.
                </span>
              </li>
              <li>
                <span className="lp-step-num">02</span>
                <strong>Kişisel risk profili</strong>
                <span>
                  Risk toleransınızı ve vade tercihinizi birlikte netleştiririz.
                </span>
              </li>
              <li>
                <span className="lp-step-num">03</span>
                <strong>Yatırım stratejisi</strong>
                <span>
                  Hedeflerinize uygun portföy önerisi ve öncelikli adımları özetleriz.
                </span>
              </li>
              <li>
                <span className="lp-step-num">04</span>
                <strong>Danışmanlık ve rapor</strong>
                <span>
                  30 dakikalık ücretsiz telefon danışmanlığı ve güncel piyasa
                  değerlendirme özeti sunarız.
                </span>
              </li>
            </ol>
          </div>
        </section>

        <section id="yorumlar" className="lp-section">
          <div className="lp-container">
            <header className="lp-section-head">
              <h2>Müşteri yorumları</h2>
              <p>
                Danışmanlık sürecine katılan yatırımcılarımızın deneyimlerinden
                kısa kesitler.
              </p>
            </header>
            <div className="lp-testimonials">
              <figure className="lp-t-card">
                <blockquote>
                  “İki yıl içinde hedeflerime yaklaşmamda ciddi katkı sağladılar.
                  Şeffaf iletişim ve düzenli portföy takibi benim için çok değerli.”
                </blockquote>
                <figcaption>
                  <span className="lp-t-name">Ahmet Yılmaz</span>
                </figcaption>
              </figure>
              <figure className="lp-t-card">
                <blockquote>
                  “Güvenli yatırım stratejileri ve risk odaklı yaklaşım sayesinde
                  planıma daha güvenle bağlı kaldım.”
                </blockquote>
                <figcaption>
                  <span className="lp-t-name">Fatma Demir</span>
                </figcaption>
              </figure>
            </div>
            <div className="lp-trust-note">
              <IconBolt />
              <p>
                Meridian Trade olarak veri güvenliğine ve düzenlemelere uygun
                süreçlere önem veriyoruz; tüm görüşmeler gizlilik çerçevesindedir.
              </p>
            </div>
          </div>
        </section>

        <section className="lp-cta lp-cta--extended">
          <div className="lp-container lp-cta-inner">
            <h2>Ücretsiz yatırım analizi</h2>
            <p>
              Size özel yatırım stratejinizi oluşturmak için aşağıdaki formu doldurun.
            </p>
            <ul className="lp-benefits" aria-label="Analiz sonrası size sunulanlar">
              <li>
                <strong>Kişisel risk profili</strong>
                <span>Size özel risk toleransınızı belirleriz.</span>
              </li>
              <li>
                <strong>Yatırım stratejisi</strong>
                <span>Hedeflerinize uygun portföy önerisi.</span>
              </li>
              <li>
                <strong>Ücretsiz danışmanlık</strong>
                <span>30 dakikalık telefon danışmanlığı.</span>
              </li>
              <li>
                <strong>Piyasa analizi</strong>
                <span>Güncel piyasa değerlendirme özeti.</span>
              </li>
            </ul>
            <dl className="lp-analiz-meta">
              <div>
                <dt>Form süresi</dt>
                <dd>~3 dakika</dd>
              </div>
              <div>
                <dt>Geri dönüş</dt>
                <dd>24 saat içinde</dd>
              </div>
            </dl>
            <div
              id={FORM_SECTION_ID}
              className="lp-form-scroll-anchor"
              tabIndex={-1}
              aria-hidden="true"
            />
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer-grid">
          <div>
            <span className="lp-footer-brand">Meridian Trade</span>
            <p className="lp-footer-tag">
              Profesyonel yatırım danışmanlığı ve portföy analizi.
            </p>
          </div>
          <div className="lp-footer-links">
            <span className="lp-footer-col-title">Şirket</span>
            <a href={`#${FORM_SECTION_ID}`}>Hakkımızda</a>
            <a href={`#${FORM_SECTION_ID}`}>Ücretsiz analiz</a>
            <a href={`#${FORM_SECTION_ID}`}>Referanslar</a>
          </div>
          <div className="lp-footer-links">
            <span className="lp-footer-col-title">Yasal</span>
            <a href={`#${FORM_SECTION_ID}`}>Kullanım koşulları</a>
            <a href={`#${FORM_SECTION_ID}`}>Gizlilik</a>
            <a href={`#${FORM_SECTION_ID}`}>Çerez politikası</a>
          </div>
        </div>
        <div className="lp-container lp-footer-disclaimer">
          <p>
            ** Memnuniyet ve başarı oranı ifadeleri hedef veya anket sonuçlarına
            dayanabilir; sonuçlar kişiye göre değişir.
          </p>
          <p>
            *** Yönetilen portföy hacmi örnek veya hedef büyüklüğü olabilir;
            güncel rakamlar için iletişime geçin.
          </p>
          <p>
            Yatırım araçları risk içerir; sermaye kaybı yaşanabilir. Bu site
            kişisel yatırım tavsiyesi teşkil etmez. Meridian Trade örnek bir
            markadır; iletişim için{' '}
            <a href={`#${FORM_SECTION_ID}`}>yukarıdaki formu</a> kullanabilirsiniz.
          </p>
          <p className="lp-footer-copy">© {new Date().getFullYear()} Meridian Trade. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
