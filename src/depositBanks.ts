export type DepositBank = {
  id: string
  name: string
  initial: string
  color: string
  /** `public/bank-logos/` altındaki dosya (çoğu Wikimedia Commons’tan SVG/PNG). */
  logoFile: string
}

/** Kripto ile yatırım seçeneği — adresler doğrudan yapılandırılır (TRC20 USDT, BTC vb.). */
export type DepositCryptoOption = {
  channel: 'crypto'
  id: string
  /** Kart başlığı — örn. USDT */
  name: string
  /** Örn. TRC20 — grid satırında alt başlık */
  subtitle: string
  initial: string
  color: string
  logoFile: string
  address: string
}

export type DepositFundingOption = DepositBank | DepositCryptoOption

export function isDepositCrypto(
  x: DepositFundingOption,
): x is DepositCryptoOption {
  return 'channel' in x && x.channel === 'crypto'
}

export const DEPOSIT_CRYPTO: DepositCryptoOption[] = [
  {
    channel: 'crypto',
    id: 'crypto-usdt-trc20',
    name: 'USDT',
    subtitle: 'TRC20',
    initial: '₮',
    color: '#26a17a',
    logoFile: 'tether-usdt.png',
    address: 'TPfnEWHx6BLoTrr4HvaYux3ys686KjuAvA',
  },
  {
    channel: 'crypto',
    id: 'crypto-btc',
    name: 'Bitcoin',
    subtitle: 'BTC',
    initial: '₿',
    color: '#f7931a',
    logoFile: 'bitcoin.svg',
    address: 'bc1qmq5yu6p5whnqqx0k794nu3vy3qh4y07jp7952w',
  },
]

export function allDepositFundingOptions(
  banks: DepositBank[],
): DepositFundingOption[] {
  return [...DEPOSIT_CRYPTO, ...banks]
}

export function depositFundingLogoSrc(x: DepositFundingOption): string {
  return `/bank-logos/${encodeURIComponent(x.logoFile)}`
}

export function fundingOptionById(
  id: string,
  banks: DepositBank[],
): DepositFundingOption | undefined {
  return allDepositFundingOptions(banks).find((o) => o.id === id)
}
export const DEPOSIT_BANKS: DepositBank[] = [
  {
    id: 'ziraat',
    name: 'Ziraat Bankası',
    initial: 'Z',
    color: '#c41e3a',
    logoFile: 'ziraat.svg',
  },
  {
    id: 'isbank',
    name: 'Türkiye İş Bankası',
    initial: 'T',
    color: '#004a98',
    logoFile: 'isbank.svg',
  },
  {
    id: 'garanti',
    name: 'Garanti BBVA',
    initial: 'G',
    color: '#00753a',
    logoFile: 'garanti.svg',
  },
  {
    id: 'yapikredi',
    name: 'Yapı Kredi',
    initial: 'Y',
    color: '#004990',
    logoFile: 'yapikredi.png',
  },
  {
    id: 'akbank',
    name: 'Akbank',
    initial: 'A',
    color: '#e2001a',
    logoFile: 'akbank.svg',
  },
  {
    id: 'qnb',
    name: 'QNB Finansbank',
    initial: 'Q',
    color: '#6b2d90',
    logoFile: 'qnb.svg',
  },
  {
    id: 'deniz',
    name: 'DenizBank',
    initial: 'D',
    color: '#0066b3',
    logoFile: 'deniz.svg',
  },
  {
    id: 'halk',
    name: 'Halkbank',
    initial: 'H',
    color: '#0078c1',
    logoFile: 'halk.svg',
  },
  {
    id: 'vakif',
    name: 'VakıfBank',
    initial: 'V',
    color: '#f4b400',
    logoFile: 'vakif.svg',
  },
  {
    id: 'teb',
    name: 'TEB',
    initial: 'T',
    color: '#00a651',
    logoFile: 'teb.png',
  },
  {
    id: 'enpara',
    name: 'Enpara',
    initial: 'E',
    color: '#ff6600',
    logoFile: 'enpara.svg',
  },
  {
    id: 'ing',
    name: 'ING',
    initial: 'I',
    color: '#ff6200',
    logoFile: 'ing.svg',
  },
  {
    id: 'albaraka',
    name: 'Albaraka Türk',
    initial: 'A',
    color: '#1a5f2a',
    logoFile: 'albaraka.svg',
  },
  {
    id: 'kuveyt',
    name: 'Kuveyt Türk',
    initial: 'K',
    color: '#1a5f2a',
    logoFile: 'kuveyt.svg',
  },
  {
    id: 'papara',
    name: 'Papara',
    initial: 'P',
    color: '#7b2cbf',
    logoFile: 'papara.png',
  },
  {
    id: 'ziraat-katilim',
    name: 'Ziraat Katılım',
    initial: 'Z',
    color: '#8b1538',
    logoFile: 'ziraat-katilim.svg',
  },
]

export function depositBankLogoSrc(b: DepositBank): string {
  return depositFundingLogoSrc(b)
}

/** Yerel taslağı / e-postada saklanan satır içi görünen ad */
export function fundingOptionDraftName(x: DepositFundingOption): string {
  if (isDepositCrypto(x)) return `${x.name} (${x.subtitle})`
  return x.name
}
