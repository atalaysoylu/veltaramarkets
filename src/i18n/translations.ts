export type Locale = 'tr' | 'en'

/** İç içe nesne + dizi; t('a.b.0.c') ile okunur */
export const tr = {
  meta: {
    htmlLang: 'tr',
    pageTitle: 'Veltara Markets — Akıllı Yatırım Danışmanlığı',
    pageDescription:
      'Veltara Markets — Profesyonel Yatırım Danışmanlığı, Portföy Analizi ve Ücretsiz Yatırım Değerlendirmesi.',
  },
  nav: {
    ariaMain: 'Ana Menü',
    services: 'Hizmetler',
    process: 'Süreç',
    reviews: 'Yorumlar',
    freeAnalysis: 'Ücretsiz Analiz',
  },
  header: {
    moreInfo: 'Daha Fazla Bilgi',
    menuClose: 'Menüyü Kapat',
    menuOpen: 'Menüyü Aç',
  },
  lang: {
    switch: 'Dil',
    tr: 'TR',
    en: 'EN',
  },
  hero: {
    ariaCarousel: 'Öne Çıkan Mesajlar',
    statInvestors: 'Aktif Yatırımcı',
    statYears: 'Yıl Deneyim',
    statReply: 'Geri Dönüş',
    ctaPrimary: 'Hemen Başlayın',
    ctaSecondary: 'Ücretsiz Analiz',
    trust1: 'Şeffaf Ücret Yapısı',
    trust2: 'Risk Odaklı Planlama',
    trust3: '7/24 Destek',
    prevSlide: 'Önceki Slayt',
    nextSlide: 'Sonraki Slayt',
    pickSlide: 'Slayt Seç',
    slideN: 'Slayt {n}',
    paused: 'Duraklatıldı',
    slides: [
      {
        eyebrow: 'Dünya Piyasaları',
        titleBefore: 'Piyasalara ',
        titleEm: 'Profesyonel',
        titleAfter: ' Mesafede Olun',
        lead:
          'Hisse, endeks ve döviz gibi varlıklarda şeffaf danışmanlık ve portföy odaklı yaklaşım — kurumsal broker sitelerinde gördüğünüz netlik ve güven hissi.',
      },
      {
        eyebrow: 'Hız ve Şeffaflık',
        titleBefore: 'Stratejinizi ',
        titleEm: 'Veriyle',
        titleAfter: ' Güçlendirin',
        lead:
          'Risk profilinize uygun senaryolar, düzenli değerlendirme ve anlaşılır raporlama. Yatırım kararlarınızı tek başınıza değil, bir plan çerçevesinde alın.',
      },
      {
        eyebrow: 'Veltara Markets',
        titleBefore: 'Geleceğe ',
        titleEm: 'Bugünden',
        titleAfter: ' Konum Alın',
        lead:
          'Ücretsiz analiz formu ile hedeflerinizi paylaşın; size özel özet ve görüşme için en kısa sürede dönüş yapalım.',
      },
    ],
  },
  stats: {
    aria: 'Öne Çıkan Rakamlar',
    happyInvestors: 'Mutlu Yatırımcı',
    satisfaction: 'Hedeflenen Memnuniyet Oranı**',
    yearsExp: 'Yıllık Deneyim',
    portfolioVol: 'Yönetilen Portföy Hacmi***',
  },
  markets: {
    title: 'Küresel Piyasalarda Çeşitli Ürünlerle İşlem',
    subtitleBefore: 'Tüm değerler yalnızca referans içindir; güncel kotasyonlar için\nMT4/MT5 veya ',
    subtitleAfter: ' mobil uygulamasını\nkontrol edin.',
    colSymbol: 'Sembol',
    colSpread: 'Spread',
    colSell: 'Satış',
    colBuy: 'Alış',
    colChange: 'Değişim',
    colProduct: 'Ürün',
    colDetailSr: 'Detay',
    rowAria: '{symbol} — İletişim Formuna Git',
    foot:
      '* Fiyatlar yalnızca gösterim amaçlıdır; gerçek işlem koşulları platform\nüzerinden geçerlidir.',
    category: {
      metals: 'Metaller',
      stocks: 'Hisseler',
      forex: 'Forex',
      indices: 'Endeksler',
      commodities: 'Emtialar',
      bonds: 'Tahviller',
      etf: 'ETF',
    },
  },
  payment: {
    aria: 'Desteklenen Ödeme Yöntemleri',
    note: '*Veltara Markets birden fazla küresel ödeme yöntemi ile çalışır.',
    bankLabel: 'Banka Havalesi',
    bankText: 'BANK TRANSFER',
  },
  services: {
    title: 'Hizmetlerimiz',
    intro:
      'Profesyonel yatırım danışmanlığı ile finansal hedeflerinize\nulaşmanız için portföyünüzü analiz eder, stratejinizi netleştiririz.',
    card1Title: 'Güvenli Yatırım',
    card1Body:
      'Risk analizleri ve senaryo çalışmaları ile size uygun, güvenli\nyatırım stratejileri öneriyoruz.',
    card2Title: 'Portföy Analizi',
    card2Body:
      'Varlık dağılımınızı ve getiri-risk dengenizi inceleyerek\nkişiselleştirilmiş portföy optimizasyonu sunuyoruz.',
    card3Title: 'Çeşitlendirme',
    card3Body:
      'Dengeli risk dağılımı ile uzun vadeli hedeflerinize uygun,\nçeşitlendirilmiş yapı kurmanıza yardımcı oluyoruz.',
  },
  process: {
    title: 'Ücretsiz Yatırım Analizi Nasıl İşler?',
    intro:
      'Bilgilerinizi paylaşın; size özel yatırım stratejinizi oluşturmak\niçin kısa bir değerlendirme yapalım.',
    step1Title: 'Form ve Ön Görüşme',
    step1Body:
      'Yaklaşık 3 dakikada temel bilgilerinizi iletirsiniz; ekibimiz\n24 saat içinde size döner.',
    step2Title: 'Kişisel Risk Profili',
    step2Body: 'Risk toleransınızı ve vade tercihinizi birlikte netleştiririz.',
    step3Title: 'Yatırım Stratejisi',
    step3Body:
      'Hedeflerinize uygun portföy önerisi ve öncelikli adımları özetleriz.',
    step4Title: 'Danışmanlık ve Rapor',
    step4Body:
      '30 dakikalık ücretsiz telefon danışmanlığı ve güncel piyasa\ndeğerlendirme özeti sunarız.',
  },
  testimonials: {
    title: 'Müşteri Yorumları',
    intro: 'Danışmanlık sürecine katılan yatırımcılarımızın deneyimlerinden\nkısa kesitler.',
    q1: '“İki yıl içinde hedeflerime yaklaşmamda ciddi katkı sağladılar.\nŞeffaf iletişim ve düzenli portföy takibi benim için çok değerli.”',
    name1: 'Ahmet Yılmaz',
    q2: '“Güvenli yatırım stratejileri ve risk odaklı yaklaşım sayesinde\nplanıma daha güvenle bağlı kaldım.”',
    name2: 'Fatma Demir',
    trust:
      'Veltara Markets olarak veri güvenliğine ve düzenlemelere uygun\nsüreçlere önem veriyoruz; tüm görüşmeler gizlilik çerçevesindedir.',
  },
  cta: {
    title: 'Ücretsiz Yatırım Analizi',
    intro: 'Size özel yatırım stratejinizi oluşturmak için aşağıdaki formu doldurun.',
    benefitsAria: 'Analiz Sonrası Size Sunulanlar',
    b1Title: 'Kişisel Risk Profili',
    b1Text: 'Size özel risk toleransınızı belirleriz.',
    b2Title: 'Yatırım Stratejisi',
    b2Text: 'Hedeflerinize uygun portföy önerisi.',
    b3Title: 'Ücretsiz Danışmanlık',
    b3Text: '30 dakikalık telefon danışmanlığı.',
    b4Title: 'Piyasa Analizi',
    b4Text: 'Güncel piyasa değerlendirme özeti.',
    formDuration: 'Form Süresi',
    formDurationVal: '~3 Dakika',
    response: 'Geri Dönüş',
    responseVal: '24 Saat İçinde',
  },
  form: {
    successTitle: 'Mesajınız Gönderildi',
    newMessage: 'Yeni Mesaj',
    honeypotLabel: 'Şirket',
    name: 'Ad Soyad *',
    email: 'E-posta *',
    phone: 'Telefon',
    message: 'Mesajınız *',
    submit: 'Gönder',
    submitting: 'Gönderiliyor…',
    errRequired: 'Ad Soyad, E-posta ve Mesaj Zorunludur.',
    errEmail: 'Geçerli Bir E-posta Adresi Girin.',
    errSubmit: 'Gönderilemedi. Lütfen Tekrar Deneyin.',
    emailSubject: 'Veltara Markets — İletişim Formu',
  },
  footer: {
    tagline: 'Profesyonel Yatırım Danışmanlığı ve Portföy Analizi.',
    colCompany: 'Şirket',
    about: 'Hakkımızda',
    references: 'Referanslar',
    colLegal: 'Yasal',
    terms: 'Kullanım Koşulları',
    privacy: 'Gizlilik',
    cookies: 'Çerez Politikası',
    disc1:
      '** Memnuniyet ve başarı oranı ifadeleri hedef veya anket sonuçlarına\ndayanabilir; sonuçlar kişiye göre değişir.',
    disc2:
      '*** Yönetilen portföy hacmi örnek veya hedef büyüklüğü olabilir;\ngüncel rakamlar için iletişime geçin.',
    disc3Before:
      'Yatırım araçları risk içerir; sermaye kaybı yaşanabilir. Bu site\nkişisel yatırım tavsiyesi teşkil etmez. Veltara Markets örnek bir\nmarkadır; iletişim için ',
    disc3Link: 'yukarıdaki formu',
    disc3After: ' kullanabilirsiniz.',
    copy: '© {year} Veltara Markets. Tüm Hakları Saklıdır.',
  },
}

export type Messages = typeof tr

export const en = {
  meta: {
    htmlLang: 'en',
    pageTitle: 'Veltara Markets — Smart investment advisory',
    pageDescription:
      'Veltara Markets — Professional investment advisory, portfolio analysis, and free investment assessment.',
  },
  nav: {
    ariaMain: 'Main menu',
    services: 'Services',
    process: 'Process',
    reviews: 'Reviews',
    freeAnalysis: 'Free Analysis',
  },
  header: {
    moreInfo: 'Learn More',
    menuClose: 'Close menu',
    menuOpen: 'Open menu',
  },
  lang: {
    switch: 'Language',
    tr: 'TR',
    en: 'EN',
  },
  hero: {
    ariaCarousel: 'Featured messages',
    statInvestors: 'Active investors',
    statYears: 'Years experience',
    statReply: 'Response time',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'Free Analysis',
    trust1: 'Transparent pricing',
    trust2: 'Risk-focused planning',
    trust3: '24/7 support',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    pickSlide: 'Choose slide',
    slideN: 'Slide {n}',
    paused: 'Paused',
    slides: [
      {
        eyebrow: 'Global markets',
        titleBefore: 'Keep a ',
        titleEm: 'professional',
        titleAfter: ' distance to the markets',
        lead:
          'Transparent advisory and a portfolio-first mindset across equities, indices, and FX — the clarity and confidence you expect from institutional-grade broker experiences.',
      },
      {
        eyebrow: 'Speed & transparency',
        titleBefore: 'Strengthen your strategy with ',
        titleEm: 'data',
        titleAfter: '',
        lead:
          'Scenarios aligned with your risk profile, regular reviews, and clear reporting. Make investment decisions within a plan — not in isolation.',
      },
      {
        eyebrow: 'Veltara Markets',
        titleBefore: 'Secure your future ',
        titleEm: 'starting today',
        titleAfter: '',
        lead:
          'Share your goals via our free analysis form; we will get back to you as soon as possible with a tailored summary and next steps.',
      },
    ],
  },
  stats: {
    aria: 'Key figures',
    happyInvestors: 'Happy investors',
    satisfaction: 'Target satisfaction rate**',
    yearsExp: 'Years of experience',
    portfolioVol: 'Assets under advisory***',
  },
  markets: {
    title: 'Trade diverse products across global markets',
    subtitleBefore: 'All figures are indicative only; for live quotes check\nMT4/MT5 or the ',
    subtitleAfter: '\nmobile app.',
    colSymbol: 'Symbol',
    colSpread: 'Spread',
    colSell: 'Sell',
    colBuy: 'Buy',
    colChange: 'Change',
    colProduct: 'Product',
    colDetailSr: 'Details',
    rowAria: '{symbol} — Go to contact form',
    foot:
      '* Prices are for display only; actual trading conditions apply on the platform.',
    category: {
      metals: 'Metals',
      stocks: 'Stocks',
      forex: 'Forex',
      indices: 'Indices',
      commodities: 'Commodities',
      bonds: 'Bonds',
      etf: 'ETF',
    },
  },
  payment: {
    aria: 'Supported payment methods',
    note: '*Veltara Markets works with multiple global payment methods.',
    bankLabel: 'Bank transfer',
    bankText: 'BANK TRANSFER',
  },
  services: {
    title: 'Our services',
    intro:
      'We analyse your portfolio and clarify your strategy with professional\ninvestment advisory so you can reach your financial goals.',
    card1Title: 'Secure investing',
    card1Body:
      'We recommend prudent strategies suited to you, supported by risk\nanalysis and scenario work.',
    card2Title: 'Portfolio analysis',
    card2Body:
      'We review your asset mix and return–risk balance and deliver\npersonalised portfolio optimisation.',
    card3Title: 'Diversification',
    card3Body:
      'We help you build a diversified structure aligned with long-term\ngoals and balanced risk.',
  },
  process: {
    title: 'How does the free investment analysis work?',
    intro:
      'Share your details; we will run a short assessment to shape your\npersonal investment strategy.',
    step1Title: 'Form & intro call',
    step1Body:
      'Send your basics in about 3 minutes; our team responds within\n24 hours.',
    step2Title: 'Personal risk profile',
    step2Body: 'We align on your risk tolerance and time horizon together.',
    step3Title: 'Investment strategy',
    step3Body:
      'We summarise portfolio suggestions and priority next steps for your goals.',
    step4Title: 'Advisory & report',
    step4Body:
      'A 30-minute free phone consultation plus a concise market\ndevelopment summary.',
  },
  testimonials: {
    title: 'Client testimonials',
    intro: 'Short excerpts from investors who joined our advisory process.',
    q1: '“They made a real difference in moving toward my goals over two years.\nTransparent communication and steady portfolio reviews mattered a lot.”',
    name1: 'Ahmet Yilmaz',
    q2: '“Safer investment strategies and a risk-first mindset helped me\nstick to my plan with more confidence.”',
    name2: 'Fatma Demir',
    trust:
      'At Veltara Markets we prioritise data security and compliant\nprocesses; all conversations are confidential.',
  },
  cta: {
    title: 'Free investment analysis',
    intro: 'Fill out the form below to build your personal investment strategy.',
    benefitsAria: 'What you receive after the analysis',
    b1Title: 'Personal risk profile',
    b1Text: 'We define risk tolerance tailored to you.',
    b2Title: 'Investment strategy',
    b2Text: 'Portfolio suggestions aligned with your goals.',
    b3Title: 'Free consultation',
    b3Text: 'A 30-minute phone consultation.',
    b4Title: 'Market analysis',
    b4Text: 'A concise market developments summary.',
    formDuration: 'Form time',
    formDurationVal: '~3 minutes',
    response: 'Response',
    responseVal: 'Within 24 hours',
  },
  form: {
    successTitle: 'Your message was sent',
    newMessage: 'New message',
    honeypotLabel: 'Company',
    name: 'Full name *',
    email: 'Email *',
    phone: 'Phone',
    message: 'Your message *',
    submit: 'Send',
    submitting: 'Sending…',
    errRequired: 'Full name, email, and message are required.',
    errEmail: 'Please enter a valid email address.',
    errSubmit: 'Could not send. Please try again.',
    emailSubject: 'Veltara Markets — Contact form',
  },
  footer: {
    tagline: 'Professional investment advisory and portfolio analysis.',
    colCompany: 'Company',
    about: 'About us',
    references: 'References',
    colLegal: 'Legal',
    terms: 'Terms of use',
    privacy: 'Privacy',
    cookies: 'Cookie policy',
    disc1:
      '** Satisfaction and performance statements may reflect targets or\nsurvey results; outcomes vary by individual.',
    disc2:
      '*** Assets under advisory may be illustrative or target figures;\ncontact us for current numbers.',
    disc3Before:
      'Investments involve risk; you may lose capital. This site does not\nconstitute personal investment advice. Veltara Markets is a sample\nbrand; to get in touch use the ',
    disc3Link: 'form above',
    disc3After: '.',
    copy: '© {year} Veltara Markets. All rights reserved.',
  },
} satisfies Messages

export const translations: Record<Locale, Messages> = { tr, en }
