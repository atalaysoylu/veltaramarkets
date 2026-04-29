import { getAll } from '@vercel/edge-config'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type IbanInfo = {
  holder: string
  bank: string
  iban: string
  swift: string
}

type CryptoEntry = {
  label: string
  address: string
}

type PaymentConfig = {
  iban: IbanInfo
  crypto: CryptoEntry[]
}

const FALLBACK: PaymentConfig = {
  iban: {
    holder: 'PİRAMİT BASILI YAYIM HİZMETLERİ PAZARLAMA LİMİTED ŞİRKETİ',
    bank: 'TÜRKİYE İŞ BANKASI',
    iban: 'TR39 0006 4000 0011 0891 4718 90',
    swift: '',
  },
  crypto: [
    {
      label: 'USDT (TRC20)',
      address: 'TMfzrSe1Ye8pnDMY9jTzAKrhBNk3G3rWRU',
    },
  ],
}

function isIbanInfo(value: unknown): value is IbanInfo {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.holder === 'string' &&
    typeof v.bank === 'string' &&
    typeof v.iban === 'string' &&
    typeof v.swift === 'string'
  )
}

function isCryptoArray(value: unknown): value is CryptoEntry[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (e) =>
      e &&
      typeof e === 'object' &&
      typeof (e as Record<string, unknown>).label === 'string' &&
      typeof (e as Record<string, unknown>).address === 'string',
  )
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const all = await getAll()
    const iban = isIbanInfo(all?.iban) ? all.iban : FALLBACK.iban
    const crypto = isCryptoArray(all?.crypto) ? all.crypto : FALLBACK.crypto

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ iban, crypto } satisfies PaymentConfig)
  } catch {
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(FALLBACK)
  }
}
