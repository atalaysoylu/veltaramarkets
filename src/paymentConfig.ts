export type IbanInfo = {
  holder: string
  bank: string
  iban: string
  swift: string
}

export type CryptoEntry = {
  label: string
  address: string
}

export type PaymentConfig = {
  iban: IbanInfo
  crypto: CryptoEntry[]
}

/** Yatırım özeti ile eşleşen varsayılanlar (api/payment-config ile aynı) */
export const FALLBACK_PAYMENT_CONFIG: PaymentConfig = {
  iban: {
    holder: 'PİRAMİT BASILI YAYIM HİZMETLERİ PAZARLAMA LİMİTED ŞİRKETİ',
    bank: 'TÜRKİYE İŞ BANKASI',
    iban: 'TR39 0006 4000 0011 0891 4718 90',
    swift: '',
  },
  crypto: [{ label: 'USDT (TRC20)', address: 'TMfzrSe1Ye8pnDMY9jTzAKrhBNk3G3rWRU' }],
}

export function isPaymentConfig(value: unknown): value is PaymentConfig {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  const iban = v.iban as Record<string, unknown> | undefined
  const ibanOk =
    !!iban &&
    typeof iban.holder === 'string' &&
    typeof iban.bank === 'string' &&
    typeof iban.iban === 'string' &&
    typeof iban.swift === 'string'
  const cryptoOk =
    Array.isArray(v.crypto) &&
    v.crypto.every(
      (e) =>
        e &&
        typeof e === 'object' &&
        typeof (e as Record<string, unknown>).label === 'string' &&
        typeof (e as Record<string, unknown>).address === 'string',
    )
  return ibanOk && cryptoOk
}

export function compactIban(ibanFormatted: string) {
  return ibanFormatted.replace(/\s/g, '').toUpperCase()
}
