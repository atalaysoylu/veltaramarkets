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
    liveAccount: 'Gerçek Hesap',
    freeAnalysis: 'Ücretsiz Analiz',
  },
  header: {
    moreInfo: 'Daha Fazla Bilgi',
    openLiveAccount: 'Gerçek hesap oluştur',
    home: 'Ana sayfa',
    menuClose: 'Menüyü Kapat',
    menuOpen: 'Menüyü Aç',
  },
  lang: {
    switch: 'Dil',
    tr: 'TR',
    en: 'EN',
  },
  liveAccount: {
    metaTitle: 'Veltara Markets — Gerçek Hesap Oluştur',
    title: 'Gerçek hesap oluştur',
    intro:
      'Canlı işlem hesabı için başvurunuzu iletin. Bilgileriniz güvenli biçimde değerlendirilir; ekibimiz e-posta ile size döner.',
    notice:
      'Bu form tanıtım amaçlıdır. Gerçek hesap açılışı için ek doğrulama ve belge talebi olabilir.',
    passwordHint:
      '8–16 karakter; büyük ve küçük harf (A–Z, a–z); rakam (0–9); en az bir özel karakter (!@#$%^&* vb.).',
    passwordEmailNote:
      'Güvenlik nedeniyle şifreniz e-posta ile gönderilmez; yalnızca kurallara uyduğunuz teyit edilir.',
    passwordHintShort:
      '8–16 karakter; büyük/küçük harf, rakam ve özel karakter. Şifre e-postada yer almaz.',
    accountType: 'Hesap türü',
    individual: 'Bireysel',
    company: 'Kurumsal',
    fullName: 'Ad Soyad *',
    country: 'Ülke *',
    province: 'İl / eyalet',
    email: 'E-posta *',
    phone: 'Telefon',
    password: 'Şifre *',
    passwordConfirm: 'Şifre tekrar *',
    referredBy: 'Referans / davet eden (isteğe bağlı)',
    chkNotUS: 'ABD vatandaşı veya mukimi değilim.',
    submit: 'Hesap oluştur',
    submitting: 'Gönderiliyor…',
    successTitle: 'Başvurunuz alındı',
    successBody:
      'Teşekkürler. Talebiniz kaydedildi; kısa süre içinde belirttiğiniz e-posta adresine dönüş yapılacaktır.',
    newForm: 'Yeni başvuru',
    errRequired: 'Lütfen tüm zorunlu alanları doldurun.',
    errEmail: 'Geçerli bir e-posta adresi girin.',
    errPassword: 'Şifre politikasını karşılamıyor.',
    errPasswordMatch: 'Şifreler eşleşmiyor.',
    errCheckboxes: 'Devam etmek için onayları işaretleyin.',
    errSubmit: 'Gönderilemedi. Lütfen tekrar deneyin.',
    emailSubject: 'Veltara Markets — Gerçek hesap başvurusu',
    backHome: 'Ana sayfaya dön',
    honeypotLabel: 'Şirket',
    emailConfirmOk: 'Evet, onaylandı',
    emailPasswordOk: 'Politikaya uygun (şifre e-postada yok)',
    asideHeadingBefore: 'Bizi ',
    asideHeadingAccent: 'sayılarla',
    asideHeadingAfter: ' tanıyın',
    asideLead:
      'Şeffaf süreç ve güçlü altyapı ile yatırım yolculuğunuzu net ve verimli kılın.',
    asideF1Title: '1000+ ürün',
    asideF1Body: 'Forex, emtia, endeks ve daha fazlasında geniş seçenekler.',
    asideF2Title: 'Milisaniyelik işlem',
    asideF2Body: 'Rekabet avantajı için hızlı emir iletimi ve düşük gecikme.',
    asideF3Title: 'Sıkı spread',
    asideF3Body: 'ECN tarzı hesaplarda dar spread ile maliyetleri optimize edin.',
    formTitleBefore: 'Gerçek ',
    formTitleAccent: 'hesap oluştur',
    countryPlaceholder: 'Ülke seçin',
    toggleShowPassword: 'Şifreyi göster',
    toggleHidePassword: 'Şifreyi gizle',
    chkPrivacyConsent:
      'Kişisel verilerimin ürün/hizmet bilgilendirmesi, teklifler ve başvuru desteği için kullanılmasına izin veriyorum.',
    chkPrivacyDetailPrefix: 'Ayrıntılar için ',
    privacyLink: 'gizlilik bildirimimize',
    chkPrivacyDetailSuffix: ' bakın.',
  },
  hero: {
    ariaCarousel: 'Öne Çıkan Mesajlar',
    headlineBefore: 'We Set ',
    headlineBlue: 'The Standard.',
    ctaJoin: "Veltara Markets'e Katılın",
    ctaSecondary: 'Ücretsiz Analiz',
    prevSlide: 'Önceki Slayt',
    nextSlide: 'Sonraki Slayt',
    pickSlide: 'Slayt Seç',
    slideN: 'Slayt {n}',
    feat1Num: '10K+',
    feat1Lbl: 'Aktif Müşteri',
    feat2Num: '1000+',
    feat2Lbl: 'İşlem Ürünü',
    feat3Num: 'Çoklu',
    feat3Lbl: 'Düzenleyici Lisans',
    feat4Num: '190+',
    feat4Lbl: 'Ülkeye Hizmet',
    slides: [
      {
        lead:
          'Küresel piyasalarda şeffaf danışmanlık ve portföy odaklı yaklaşım. Kurumsal kalitede netlik ve güven.',
      },
      {
        lead:
          'Risk profilinize uygun senaryolar ve anlaşılır raporlama ile yatırım kararlarınızı bir plan çerçevesinde alın.',
      },
      {
        lead:
          'Ücretsiz analiz formu ile hedeflerinizi paylaşın; kısa sürede size özel özet ve görüşme için dönüş yapalım.',
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
  topTraded: {
    sectionTitle: 'En Çok İşlem Yapılan Ürünler ve Spreadler',
    sectionSubtitle:
      'Kategoriye göre gezinin; sembol, gösterim spreadi ve ürün grubu tek bakışta.\nTüm değerler yalnızca referans içindir.',
    navAria: 'Ürün kategorileri',
    colSymbol: 'Sembol',
    colSpread: 'Spread',
    colProduct: 'Ürün',
    colDetailSr: 'Detay',
    rowAria: '{symbol} — İletişim formuna git',
    foot: '* Fiyatlandırma yalnızca gösterim amaçlıdır.',
    nav: {
      mostTraded: 'En çok işlem yapılan',
      commodities: 'Emtialar',
      indices: 'Endeksler',
      forex: 'Forex',
      etf: 'ETF',
      metals: 'Metaller',
      stocks: 'Hisse senetleri',
    },
  },
  payment: {
    aria: 'Desteklenen Ödeme Yöntemleri',
    note: '*Veltara Markets birden fazla küresel ödeme yöntemi ile çalışır.',
    bankLabel: 'Banka Havalesi',
    bankText: 'BANK TRANSFER',
  },
  ticker: {
    aria: 'Piyasa ve platform etiketleri, kaydırılan şerit',
  },
  brokerFeats: {
    aria: 'Öne Çıkan İşlem ve Hizmet Özellikleri',
    items: [
      {
        title: 'Ultra Hızlı İşlem',
        body: 'Emir ve taleplerinizi hızlı ve güvenilir biçimde işleme almayı hedefliyoruz.',
      },
      {
        title: 'Rekabetçi Spreadler',
        body: 'Düşük maliyetli işlem için şeffaf ve rekabetçi fiyat yapısı sunuyoruz.',
      },
      {
        title: 'Esnek Kaldıraç',
        body: 'Stratejinize uygun risk ve pozisyon büyüklüğü tercihlerini birlikte değerlendiriyoruz.',
        note: '*Şartlar ve düzenleyici gerekliliklere tabidir.',
      },
      {
        title: 'Kolay İşlemler',
        body: 'Tanınmış yöntemlerle hızlı ve sorunsuz fonlama ile çekim süreçleri.',
      },
      {
        title: '7/24 Çok Dilli Destek',
        body: 'İhtiyaç duyduğunuz her an, tercih ettiğiniz dilde yardım alın.',
      },
      {
        title: 'Uyumluluk Odaklı Süreçler',
        body: 'Veltara Markets; veri güvenliği, şeffaflık ve düzenlemelere uygun süreçlere önem verir.',
      },
    ],
  },
  globalAwards: {
    aria: 'Küresel ödüller ve tanınma',
    headingCyan: 'Küresel Ödüllere',
    headingNavy: 'Sahip Lider Broker',
    items: [
      {
        lines: ['EN İYİ FOREX SPREADLERİ', 'MONEY EXPO MEXICO'],
        year: '2023',
      },
      {
        lines: ['YILIN EN İYİ', 'FOREX BROKERI'],
        year: '2024',
      },
      {
        lines: ['YILIN EN İYİ FOREX', 'LİKİDİTE SAĞLAYICISI'],
        year: '2024',
      },
      {
        lines: ['EN İYİ AFFİLİATE', 'FOREX BROKERI'],
        year: '2024',
      },
      {
        lines: ['YILIN EN GÜVENİLİR', 'BROKERI'],
        year: '2024',
      },
    ],
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
    errSubmitActivation:
      'Form henüz etkin değil: FormSubmit, alıcı e-postanıza bir onay gönderir. Gelen kutunuzda ve spamde "Activate Form" bağlantısına tıklayın; ardından tekrar deneyin.',
    errSubmitNeedServer:
      'Form yalnızca bir web sunucusundan çalışır (ör. npm run dev ile localhost). Sayfayı dosya olarak (file://) açmayın.',
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
    licenses: {
      aria: 'Düzenleyici lisanslar ve borsa üyelikleri',
      title: 'Lisanslar ve ortaklar',
      items: [
        {
          id: 'fca',
          alt: 'FCA — Birleşik Krallık Financial Conduct Authority düzenleyicisi',
          caption: 'FCA · UK',
        },
        {
          id: 'cysec',
          alt: 'CySEC — Kıbrıs Menkul Kıymetler ve Borsa Komisyonu',
          caption: 'CySEC · Kıbrıs',
        },
        {
          id: 'asic',
          alt: 'ASIC — Avustralya Menkul Kıymetler ve Yatırım Komisyonu',
          caption: 'ASIC · Avustralya',
        },
        {
          id: 'finma',
          alt: 'FINMA — İsviçre Finansal Piyasa Denetleme Otoritesi',
          caption: 'FINMA · İsviçre',
        },
        {
          id: 'nasdaq',
          alt: 'Nasdaq — Küresel borsa ve piyasa altyapısı',
          caption: 'NASDAQ · ABD',
        },
        {
          id: 'bist',
          alt: 'Borsa İstanbul — Türkiye menkul kıymetler borsası',
          caption: 'BIST · Türkiye',
        },
      ],
    },
    riskLegal: {
      aria: 'Risk uyarısı, bölgesel kısıtlamalar ve düzenleyici bilgiler',
      sections: [
        {
          title: 'RİSK UYARISI',
          paragraphs: [
            "Döviz (Forex) ve Fark Sözleşmeleri (CFD'ler) gibi kaldıraçlı türev ürünlerin ticareti yüksek düzeyde risk içerir ve ilk yatırdığınız tutarı aşan kayıplarla sonuçlanabilir. Bu ürünler her yatırımcıya uygun olmayabilir. Kaldıraç hem potansiyel karı hem de zararı artırır. Bu enstrümanların alım satımını yaparken, dayanak varlıkların sahibi olmazsınız veya bunlar üzerinde herhangi bir hakka sahip olmazsınız. Geçmiş performans gelecekteki sonuçların göstergesi değildir.",
            'Herhangi bir yatırım kararı vermeden önce yatırım hedeflerinizi, bilginizi, deneyiminizi ve finansal durumunuzu dikkatlice değerlendirmelisiniz. Yalnızca yeterli bilgi ve deneyime sahipseniz Forex ve CFD ticareti yapmalısınız. Veltara Markets, ticaretten kaynaklanan herhangi bir kayıptan sorumlu değildir ve tüm ticaret faaliyetleri, risk size ait olmak üzere gerçekleştirilir.',
            'Bu web sitesinde sağlanan içerik yalnızca genel bilgilendirme amaçlıdır ve bireysel mali durumunuzu, yatırım hedeflerinizi veya risk toleransınızı dikkate almaz. CFD ticaretiyle ilgili risklerin tam olarak anlaşıldığından emin olmak için web sitemizde bulunan yasal belgeleri incelemelisiniz. Gerekirse devam etmeden önce kalifiye profesyonellerden bağımsız tavsiye alın.',
          ],
        },
        {
          title: 'BÖLGESEL KISITLAMALAR',
          paragraphs: [
            'Bu web sitesi, Amerika Birleşik Devletleri ve FATF "kara listesinde" veya diğer önemli küresel yaptırım listelerinde listelenen yargı bölgeleri dahil ancak bunlarla sınırlı olmamak üzere belirli yargı bölgelerinin vatandaşı veya mukimi olan herhangi bir kişi veya kuruluşa dağıtılmak veya bu kişiler tarafından kullanılmak üzere tasarlanmamıştır. Ayrıca bu tür bir dağıtımın veya kullanımın yerel yasa veya düzenlemeleri ihlal edeceği herhangi bir yargı bölgesinde dağıtım veya kullanıma yönelik değildir.',
          ],
        },
        {
          title: 'REGÜLATÖR BİLGİLERİ',
          paragraphs: [
            "Veltara Markets, her biri yerel düzenlemelere uygun olarak belirli finansal hizmetler sağlama yetkisine sahip, çeşitli yargı bölgelerinde düzenlenmiş ve lisanslı kuruluşlardan oluşan bir ağı temsil eden markadır. Kayıt olduktan sonra, tüm ticari faaliyetlerin ilgili düzenleyici makam tarafından yönetilmesini sağlayacak şekilde konumunuza bağlı olarak uygun kuruluşa atanacaksınız. İlgili otoriteler lisans sahiplerine menkul kıymet veya yatırım tacirliği lisansı vermiş olsa da Veltara Markets'ın sunduğu ürün veya hizmetleri onaylamamaktadır.",
            "Veltara Markets Global Financial Consultation & Financial Analysis L.L.C, Birleşik Arap Emirlikleri Sermaye Piyasası Otoritesi (CMA) tarafından düzenlenen ve 20200000241 numaralı lisansa sahip bir Kategori 5 lisans kuruluşudur. Bu lisans, şirketin BAE içinde Tanıtım ve Aracılık Tanıtımı ile ilgili düzenlenmiş faaliyetleri yürütmesine izin verir. Kayıtlı ofisi Level 2, Office 203, ONE CENTRAL, OFFICES 4, DWTC, Dubai, P.O. Box 129621, UAE adresindedir. Şirketin aracılık hizmeti sunma veya müşteri işlemlerini yürütme yetkisi bulunmamaktadır.",
            "Veltara Markets Prime Global Pty Ltd, ACN 156005668 ve AFSL No. 421210 ile Avustralya Menkul Kıymetler ve Yatırım Komisyonu (ASIC) tarafından denetlenmektedir. Kayıtlı ofisi Level 35, 31 Market Street, Sydney, NSW 2000, Avustralya'da bulunmaktadır.",
            "Veltara Markets International Pty Ltd, FSP No. 52464 ve Kayıt No. 2022/435897/07 ile Güney Afrika Finansal Sektör Davranış Otoritesi (FSCA) tarafından denetlenmektedir. Kayıtlı ofisi 18 Cavendish Yolu, Claremont, Cape Town, Batı Kap, 7708, Güney Afrika.",
            "Veltara Markets Limited, SD049 Lisans No. ve 8427362-1 Kayıt No. ile Seyşeller Finansal Hizmetler Otoritesi (FSA) tarafından denetlenmektedir. Kayıtlı ofisi Suite 3, Global Village, Jivan's Complex, Mont Fleuri, Mahe, Seychelles adresinde bulunmaktadır.",
            "Veltara Markets Financial Markets Limited, 212229 GBC Şirket Numarası ve GB24203371 Lisans Numarası ile Mauritius Finansal Hizmetler Komisyonu (FSC) tarafından denetlenmektedir. Kayıtlı ofisi Suite 201, 2nd Floor, The Catalyst, 40 Silicon Avenue, Ebene Cybercity, Mauritius adresinde bulunmaktadır.",
            "Kıbrıs Cumhuriyeti'nde HE421001 kayıt numarasıyla kayıtlı ve kayıtlı adresi 160 Archiepiskopou Makariou III, 1. Kat, 3026 Limasol, Kıbrıs olan Veltara Markets (CY) Limited, Veltara Markets şirketler grubu içindeki lisanslı ve düzenlenmiş kuruluşlar için ödeme hizmetlerini kolaylaştırmaktadır. Bu kuruluş düzenlenmiş finansal ürünler sunmamakta veya ticaret hizmetleri sağlamamaktadır.",
          ],
        },
      ],
    },
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
    liveAccount: 'Live Account',
    freeAnalysis: 'Free Analysis',
  },
  header: {
    moreInfo: 'Learn More',
    openLiveAccount: 'Open live account',
    home: 'Home',
    menuClose: 'Close menu',
    menuOpen: 'Open menu',
  },
  lang: {
    switch: 'Language',
    tr: 'TR',
    en: 'EN',
  },
  liveAccount: {
    metaTitle: 'Veltara Markets — Open Live Account',
    title: 'Open a live account',
    intro:
      'Submit your request for a live trading account. Your details are handled securely; our team will follow up by email.',
    notice:
      'This form is for lead capture. Final account opening may require additional verification and documents.',
    passwordHint:
      '8–16 characters; upper and lower case (A–Z, a–z); digits (0–9); at least one special character (!@#$%^&* etc.).',
    passwordEmailNote:
      'For security, your password is not sent by email; we only confirm it meets the policy.',
    passwordHintShort:
      '8–16 chars; upper, lower, digit & special. Password is never emailed.',
    accountType: 'Account type',
    individual: 'Individual',
    company: 'Company',
    fullName: 'Full name *',
    country: 'Country *',
    province: 'Province / state',
    email: 'Email *',
    phone: 'Phone',
    password: 'Password *',
    passwordConfirm: 'Confirm password *',
    referredBy: 'Referred by (optional)',
    chkNotUS: 'I am not a US citizen or resident.',
    submit: 'Create account',
    submitting: 'Submitting…',
    successTitle: 'Application received',
    successBody:
      'Thank you. Your request has been recorded; we will respond to the email address you provided shortly.',
    newForm: 'New application',
    errRequired: 'Please fill in all required fields.',
    errEmail: 'Enter a valid email address.',
    errPassword: 'Password does not meet the policy.',
    errPasswordMatch: 'Passwords do not match.',
    errCheckboxes: 'Please confirm the required checkboxes.',
    errSubmit: 'Could not submit. Please try again.',
    emailSubject: 'Veltara Markets — Live account application',
    backHome: 'Back to home',
    honeypotLabel: 'Company',
    emailConfirmOk: 'Yes, confirmed',
    emailPasswordOk: 'Policy satisfied (password not in email)',
    asideHeadingBefore: 'Get to Know Us ',
    asideHeadingAccent: 'in Numbers',
    asideHeadingAfter: '',
    asideLead:
      'With a transparent process and solid infrastructure, keep your investment journey clear and efficient.',
    asideF1Title: '1000+ products',
    asideF1Body: 'Broad choice across forex, commodities, indices, and more.',
    asideF2Title: 'Millisecond execution',
    asideF2Body: 'Fast order routing and low latency for a sharper edge.',
    asideF3Title: 'Tight spreads',
    asideF3Body: 'Optimize costs with competitive pricing on ECN-style access.',
    formTitleBefore: 'Open ',
    formTitleAccent: 'Live Account',
    countryPlaceholder: 'Select country',
    toggleShowPassword: 'Show password',
    toggleHidePassword: 'Hide password',
    chkPrivacyConsent:
      'I consent to the use of my personal data for product/service information, offers, and application support.',
    chkPrivacyDetailPrefix: 'See our ',
    privacyLink: 'privacy notice',
    chkPrivacyDetailSuffix: ' for details.',
  },
  hero: {
    ariaCarousel: 'Featured messages',
    headlineBefore: 'We Set ',
    headlineBlue: 'The Standard.',
    ctaJoin: 'Join Veltara Markets',
    ctaSecondary: 'Free Analysis',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    pickSlide: 'Choose slide',
    slideN: 'Slide {n}',
    feat1Num: '450,000+',
    feat1Lbl: 'Active Clients',
    feat2Num: '1000+',
    feat2Lbl: 'Trading Products',
    feat3Num: 'Multiple',
    feat3Lbl: 'Regulatory Licenses',
    feat4Num: '190+',
    feat4Lbl: 'Countries Serviced',
    slides: [
      {
        lead:
          'Transparent advisory and a portfolio-first approach across global markets — clarity and confidence at institutional quality.',
      },
      {
        lead:
          'Scenarios aligned with your risk profile, regular reviews, and clear reporting. Invest within a plan, not in isolation.',
      },
      {
        lead:
          'Share your goals via our free analysis form; we will respond with a tailored summary and next steps.',
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
  topTraded: {
    sectionTitle: 'Most traded instruments and spreads',
    sectionSubtitle:
      'Browse by category; symbol, indicative spread, and product group at a glance.\nAll figures are for reference only.',
    navAria: 'Product categories',
    colSymbol: 'Symbol',
    colSpread: 'Spread',
    colProduct: 'Product',
    colDetailSr: 'Details',
    rowAria: '{symbol} — Go to contact form',
    foot: '* Pricing is for indicative purposes only.',
    nav: {
      mostTraded: 'Most traded',
      commodities: 'Commodities',
      indices: 'Indices',
      forex: 'Forex',
      etf: 'ETF',
      metals: 'Metals',
      stocks: 'Stocks',
    },
  },
  payment: {
    aria: 'Supported payment methods',
    note: '*Veltara Markets works with multiple global payment methods.',
    bankLabel: 'Bank transfer',
    bankText: 'BANK TRANSFER',
  },
  ticker: {
    aria: 'Scrolling strip of market and platform labels',
  },
  brokerFeats: {
    aria: 'Highlighted trading and service features',
    items: [
      {
        title: 'Ultra-Fast Execution',
        body: 'We aim to process your orders quickly and reliably.',
      },
      {
        title: 'Competitive Spreads',
        body: 'Transparent, competitive pricing designed for cost-efficient trading.',
      },
      {
        title: 'Flexible Leverage',
        body: 'Review risk and position size preferences that fit your strategy.',
        note: '*Subject to terms and regulatory requirements.',
      },
      {
        title: 'Easy Transactions',
        body: 'Fast, straightforward deposits and withdrawals with familiar methods.',
      },
      {
        title: '24/7 Multilingual Support',
        body: 'Get help in your preferred language whenever you need it.',
      },
      {
        title: 'Compliance-Focused Operations',
        body: 'Veltara Markets prioritises data security, transparency, and regulatory alignment.',
      },
    ],
  },
  globalAwards: {
    aria: 'Global awards and recognition',
    headingCyan: 'Global Award-Winning',
    headingNavy: 'Leading Broker',
    items: [
      {
        lines: ['BEST FOREX SPREADS', 'MONEY EXPO MEXICO'],
        year: '2023',
      },
      {
        lines: ['BEST FOREX BROKER', 'OF THE YEAR'],
        year: '2024',
      },
      {
        lines: ['TOP FOREX LIQUIDITY', 'PROVIDER OF THE YEAR'],
        year: '2024',
      },
      {
        lines: ['BEST AFFILIATE', 'FOREX BROKER'],
        year: '2024',
      },
      {
        lines: ['THE MOST TRUSTED BROKER', 'OF THE YEAR'],
        year: '2024',
      },
    ],
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
    errSubmitActivation:
      'This form is not activated yet: FormSubmit sent a confirmation email to the recipient inbox. Open the "Activate Form" link (check spam), then try again.',
    errSubmitNeedServer:
      'Open this site through a dev server (e.g. npm run dev), not as a local file (file://).',
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
    licenses: {
      aria: 'Regulatory licences and exchange memberships',
      title: 'Licences & partners',
      items: [
        {
          id: 'fca',
          alt: 'FCA — UK Financial Conduct Authority',
          caption: 'FCA · UK',
        },
        {
          id: 'cysec',
          alt: 'CySEC — Cyprus Securities and Exchange Commission',
          caption: 'CySEC · Cyprus',
        },
        {
          id: 'asic',
          alt: 'ASIC — Australian Securities and Investments Commission',
          caption: 'ASIC · Australia',
        },
        {
          id: 'finma',
          alt: 'FINMA — Swiss Financial Market Supervisory Authority',
          caption: 'FINMA · Switzerland',
        },
        {
          id: 'nasdaq',
          alt: 'Nasdaq — Global exchange and market technology',
          caption: 'NASDAQ · US',
        },
        {
          id: 'bist',
          alt: 'Borsa Istanbul — Turkish stock exchange',
          caption: 'BIST · Türkiye',
        },
      ],
    },
    riskLegal: {
      aria: 'Risk warning, regional restrictions, and regulatory disclosures',
      sections: [
        {
          title: 'RISK WARNING',
          paragraphs: [
            'Trading leveraged derivative products such as foreign exchange (Forex) and contracts for difference (CFDs) involves a high level of risk and may result in losses exceeding your initial deposit. These products may not be suitable for all investors. Leverage magnifies both potential profits and losses. When trading these instruments, you do not own the underlying assets or hold any rights in them. Past performance is not indicative of future results.',
            'You should carefully assess your investment objectives, knowledge, experience, and financial situation before making any investment decision. You should only trade Forex and CFDs if you have sufficient knowledge and experience. Veltara Markets is not liable for any losses arising from trading, and all trading activity is undertaken at your own risk.',
            'The content provided on this website is for general information only and does not take into account your individual financial situation, investment objectives, or risk tolerance. You should review the legal documents on our website to ensure you fully understand the risks associated with CFD trading. Where appropriate, seek independent advice from qualified professionals before proceeding.',
          ],
        },
        {
          title: 'REGIONAL RESTRICTIONS',
          paragraphs: [
            'This website is not intended for distribution to, or use by, any person or entity who is a citizen or resident of certain jurisdictions, including but not limited to the United States and jurisdictions listed on the FATF “blacklist” or other major global sanctions lists, or for distribution or use in any jurisdiction where such distribution or use would contravene local laws or regulations.',
          ],
        },
        {
          title: 'REGULATORY INFORMATION',
          paragraphs: [
            'Veltara Markets is a brand representing a network of regulated and licensed entities across various jurisdictions, each authorised to provide certain financial services in line with local regulations. After registration, you will be assigned to the appropriate entity based on your location so that your trading activities are overseen by the relevant regulator. Even where authorities have granted securities or investment dealer licences to licence holders, they do not endorse the products or services offered by Veltara Markets.',
            'Veltara Markets Global Financial Consultation & Financial Analysis L.L.C is a Category 5 licensed firm regulated by the UAE Capital Markets Authority (CMA) under licence number 20200000241. This licence permits regulated promotional and introducing activities within the UAE. Its registered office is at Level 2, Office 203, ONE CENTRAL, OFFICES 4, DWTC, Dubai, P.O. Box 129621, UAE. The company is not authorised to provide brokerage services or execute client transactions.',
            'Veltara Markets Prime Global Pty Ltd (ACN 156005668, AFSL No. 421210) is regulated by the Australian Securities and Investments Commission (ASIC). Registered office: Level 35, 31 Market Street, Sydney, NSW 2000, Australia.',
            'Veltara Markets International Pty Ltd (FSP No. 52464, Registration No. 2022/435897/07) is regulated by the Financial Sector Conduct Authority (FSCA) of South Africa. Registered office: 18 Cavendish Road, Claremont, Cape Town, Western Cape, 7708, South Africa.',
            'Veltara Markets Limited (Licence No. SD049, Registration No. 8427362-1) is regulated by the Financial Services Authority (FSA) of Seychelles. Registered office: Suite 3, Global Village, Jivan’s Complex, Mont Fleuri, Mahé, Seychelles.',
            'Veltara Markets Financial Markets Limited (GBC Company No. 212229, Licence No. GB24203371) is regulated by the Financial Services Commission (FSC) of Mauritius. Registered office: Suite 201, 2nd Floor, The Catalyst, 40 Silicon Avenue, Ebene Cybercity, Mauritius.',
            'Veltara Markets (CY) Limited, registered in the Republic of Cyprus under number HE421001 with registered address at 160 Archiepiskopou Makariou III, 1st Floor, 3026 Limassol, Cyprus, facilitates payment services for licensed and regulated entities within the Veltara Markets group. This entity does not offer regulated financial products or provide trading services.',
          ],
        },
      ],
    },
    copy: '© {year} Veltara Markets. All rights reserved.',
  },
} satisfies Messages

export const translations: Record<Locale, Messages> = { tr, en }
