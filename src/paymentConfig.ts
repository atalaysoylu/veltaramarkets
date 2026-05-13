export type IbanInfo = {
  holder: string
  bank: string
  iban: string
  swift: string
  /** `depositBanks` kartı `id`; eşleşirse havale özeti önce bu IBAN’ı kullanır. */
  senderBankIds?: string[]
}

export type CryptoEntry = {
  label: string
  address: string
}

export type PaymentConfig = {
  recipientAccounts: IbanInfo[]
  crypto: CryptoEntry[]
}

/** Varsayılanlar `api/payment-config` ile uyumlu; Edge’de `iban` (tek) da desteklenir. */
export const FALLBACK_PAYMENT_CONFIG: PaymentConfig = {
  recipientAccounts: [
    {
      holder: 'EUROLİNE GLOBAL OFSET BASIM YAYIM TİCARET LİMİTED ŞİRKETİ',
      bank: 'Yapı Kredi',
      iban: 'TR66 0006 7010 0000 0199 4345 96',
      swift: '',
      senderBankIds: ['yapikredi'],
    },
    {
      holder: 'EUROLİNE GLOBAL OFSET BASIM YAYIM TİCARET LİMİTED ŞİRKETİ',
      bank: 'QNB Finansbank',
      iban: 'TR19 0011 1000 0000 0165 6876 12',
      swift: '',
      senderBankIds: ['qnb'],
    },
  ],
  crypto: [{ label: 'USDT (TRC20)', address: 'TMfzrSe1Ye8pnDMY9jTzAKrhBNk3G3rWRU' }],
}

function isCryptoArray(value: unknown): value is CryptoEntry[] {
  return (
    Array.isArray(value) &&
    value.every(
      (e) =>
        e &&
        typeof e === 'object' &&
        typeof (e as Record<string, unknown>).label === 'string' &&
        typeof (e as Record<string, unknown>).address === 'string',
    )
  )
}

function parseIbanInfo(raw: unknown): IbanInfo | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (
    typeof o.holder !== 'string' ||
    typeof o.bank !== 'string' ||
    typeof o.iban !== 'string'
  ) {
    return null
  }
  const swift = typeof o.swift === 'string' ? o.swift : ''
  let senderBankIds: string[] | undefined
  if (Array.isArray(o.senderBankIds)) {
    const ids = o.senderBankIds.filter((x): x is string => typeof x === 'string')
    if (ids.length) senderBankIds = ids
  }
  return {
    holder: o.holder,
    bank: o.bank,
    iban: o.iban,
    swift,
    ...(senderBankIds ? { senderBankIds } : {}),
  }
}

/** API veya Edge’den gelen `iban` tekli / `recipientAccounts` çoklu yapıyı tek forma çevirir. */
export function normalizePaymentConfig(data: unknown): PaymentConfig | null {
  if (!data || typeof data !== 'object') return null
  const v = data as Record<string, unknown>

  let recipientAccounts: IbanInfo[] = []
  const ra = v.recipientAccounts
  if (Array.isArray(ra)) {
    recipientAccounts = ra.map(parseIbanInfo).filter((x): x is IbanInfo => x !== null)
  }
  if (recipientAccounts.length === 0) {
    const one = parseIbanInfo(v.iban)
    if (one) recipientAccounts = [one]
  }
  if (recipientAccounts.length === 0) return null

  const crypto = v.crypto
  if (!isCryptoArray(crypto) || crypto.length === 0) return null

  return { recipientAccounts, crypto }
}

export function recipientAccountsForSenderBank(
  senderBankId: string | undefined,
  accounts: IbanInfo[],
): IbanInfo[] {
  if (accounts.length === 0) return []
  if (!senderBankId) return accounts
  const matched = accounts.filter((a) => a.senderBankIds?.includes(senderBankId))
  return matched.length > 0 ? matched : accounts
}

export function compactIban(ibanFormatted: string) {
  return ibanFormatted.replace(/\s/g, '').toUpperCase()
}

/** Form / e-posta alanı için: gösterilen tüm hesapların IBAN’ları. */
export function compactIbansJoined(accounts: IbanInfo[], sep = '; ') {
  return accounts.map((a) => compactIban(a.iban)).join(sep)
}
