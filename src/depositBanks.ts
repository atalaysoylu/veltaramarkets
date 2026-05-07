export type DepositBank = {
  id: string
  name: string
  initial: string
  color: string
}

/** Tanıtım arayüzü — banka listesi örnek */
export const DEPOSIT_BANKS: DepositBank[] = [
  { id: 'ziraat', name: 'Ziraat Bankası', initial: 'Z', color: '#c41e3a' },
  { id: 'isbank', name: 'Türkiye İş Bankası', initial: 'T', color: '#004a98' },
  { id: 'garanti', name: 'Garanti BBVA', initial: 'G', color: '#00753a' },
  { id: 'yapikredi', name: 'Yapı Kredi', initial: 'Y', color: '#004990' },
  { id: 'akbank', name: 'Akbank', initial: 'A', color: '#e2001a' },
  { id: 'qnb', name: 'QNB Finansbank', initial: 'Q', color: '#6b2d90' },
  { id: 'deniz', name: 'DenizBank', initial: 'D', color: '#0066b3' },
  { id: 'halk', name: 'Halkbank', initial: 'H', color: '#0078c1' },
  { id: 'vakif', name: 'VakıfBank', initial: 'V', color: '#f4b400' },
  { id: 'teb', name: 'TEB', initial: 'T', color: '#00a651' },
  { id: 'enpara', name: 'Enpara', initial: 'E', color: '#ff6600' },
  { id: 'ing', name: 'ING', initial: 'I', color: '#ff6200' },
  { id: 'albaraka', name: 'Albaraka Türk', initial: 'A', color: '#1a5f2a' },
  { id: 'kuveyt', name: 'Kuveyt Türk', initial: 'K', color: '#1a5f2a' },
  { id: 'papara', name: 'Papara', initial: 'P', color: '#7b2cbf' },
  { id: 'ziraat-katilim', name: 'Ziraat Katılım', initial: 'Z', color: '#8b1538' },
]
