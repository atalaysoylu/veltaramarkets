export type IbanInfo = {
  holder: string
  bank: string
  iban: string
  swift: string
  /** `depositBanks` kartı `id`; eşleşirse havale özeti önce bu IBAN’ı kullanır. */
  senderBankIds?: string[]
}

export type CryptoEntry = {
  /** `depositBanks.DEPOSIT_CRYPTO` `id`'si; ör. `crypto-usdt-trc20`, `crypto-btc`. */
  id?: string
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
      holder: 'PİRAMİT BASILI YAYIM HİZMETLERİ PAZARLAMA LİMİTED ŞİRKETİ',
      bank: 'Ziraat katılım',
      iban: 'TR71 0020 9000 0248 9202 0000 01',
      swift: '',
      senderBankIds: ['ziraatkatilim'],
    },
  ],
  crypto: [
    {
      id: 'crypto-usdt-trc20',
      label: 'USDT (TRC20)',
      address: 'TPfnEWHx6BLoTrr4HvaYux3ys686KjuAvA',
    },
    {
      id: 'crypto-btc',
      label: 'Bitcoin (BTC)',
      address: 'bc1qmq5yu6p5whnqqx0k794nu3vy3qh4y07jp7952w',
    },
  ],
}

function parseCryptoEntry(raw: unknown): CryptoEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const v = raw as Record<string, unknown>
  if (typeof v.label !== 'string' || typeof v.address !== 'string') return null
  const id = typeof v.id === 'string' && v.id.trim() ? v.id : undefined
  return { ...(id ? { id } : {}), label: v.label, address: v.address }
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

  let crypto: CryptoEntry[] = []
  if (Array.isArray(v.crypto)) {
    crypto = v.crypto.map(parseCryptoEntry).filter((x): x is CryptoEntry => x !== null)
  }
  if (crypto.length === 0) return null

  return { recipientAccounts, crypto }
}

/** `DEPOSIT_CRYPTO` opsiyonunun `id`'sine göre Edge/Vercel'deki adresi döner; yoksa varsayılanı. */
export function cryptoAddressFor(
  optionId: string,
  fallbackAddress: string,
  crypto: CryptoEntry[],
): string {
  const match = crypto.find((c) => c.id === optionId)
  if (match && match.address.trim()) return match.address.trim()
  return fallbackAddress
}

export function recipientAccountsForSenderBank(
  senderBankId: string | undefined,
  accounts: IbanInfo[],
): IbanInfo[] {
  if (accounts.length === 0) return []
  if (!senderBankId) return accounts
  const senderNorm = normalizeBankId(senderBankId)
  const matched = accounts.filter((a) =>
    a.senderBankIds?.some((id) => normalizeBankId(id) === senderNorm),
  )
  return matched.length > 0 ? matched : accounts
}

export function normalizeBankId(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function compactIban(ibanFormatted: string) {
  return ibanFormatted.replace(/\s/g, '').toUpperCase()
}

/** Form / e-posta alanı için: gösterilen tüm hesapların IBAN’ları. */
export function compactIbansJoined(accounts: IbanInfo[], sep = '; ') {
  return accounts.map((a) => compactIban(a.iban)).join(sep)
}
