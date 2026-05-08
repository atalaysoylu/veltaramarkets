export type DepositBank = {
  id: string
  name: string
  initial: string
  color: string
  /** `public/bank-logos/` altındaki dosya (çoğu Wikimedia Commons’tan SVG/PNG). */
  logoFile: string
}

/** Tanıtım arayüzü — banka listesi örnek */
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
  return `/bank-logos/${encodeURIComponent(b.logoFile)}`
}
