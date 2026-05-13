/** Edge Config: `recipientAccounts[]` veya tek `iban`; `crypto` dizi. Varsayılanlar `src/paymentConfig.ts` ile aynı olmalı. */
import { getAll } from '@vercel/edge-config'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type IbanInfo = {
  holder: string
  bank: string
  iban: string
  swift: string
  senderBankIds?: string[]
}

type CryptoEntry = {
  label: string
  address: string
}

type PaymentConfig = {
  recipientAccounts: IbanInfo[]
  crypto: CryptoEntry[]
}

const FALLBACK: PaymentConfig = {
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
  crypto: [
    {
      label: 'USDT (TRC20)',
      address: 'TMfzrSe1Ye8pnDMY9jTzAKrhBNk3G3rWRU',
    },
  ],
}

function parseIban(raw: unknown): IbanInfo | null {
  if (!raw || typeof raw !== 'object') return null
  const v = raw as Record<string, unknown>
  if (
    typeof v.holder !== 'string' ||
    typeof v.bank !== 'string' ||
    typeof v.iban !== 'string'
  ) {
    return null
  }
  const swift = typeof v.swift === 'string' ? v.swift : ''
  let senderBankIds: string[] | undefined
  if (Array.isArray(v.senderBankIds)) {
    const ids = v.senderBankIds.filter((x): x is string => typeof x === 'string')
    if (ids.length) senderBankIds = ids
  }
  return {
    holder: v.holder,
    bank: v.bank,
    iban: v.iban,
    swift,
    ...(senderBankIds ? { senderBankIds } : {}),
  }
}

function parseRecipientAccounts(all: Record<string, unknown>): IbanInfo[] {
  const ra = all.recipientAccounts
  if (Array.isArray(ra)) {
    const list = ra.map(parseIban).filter((x): x is IbanInfo => x !== null)
    if (list.length) return list
  }
  const one = parseIban(all.iban)
  return one ? [one] : []
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const all = (await getAll()) as Record<string, unknown>

    let recipientAccounts = parseRecipientAccounts(all)
    if (recipientAccounts.length === 0) recipientAccounts = FALLBACK.recipientAccounts

    let crypto = FALLBACK.crypto
    const c = all.crypto
    if (
      Array.isArray(c) &&
      c.every(
        (e) =>
          e &&
          typeof e === 'object' &&
          typeof (e as Record<string, unknown>).label === 'string' &&
          typeof (e as Record<string, unknown>).address === 'string',
      )
    ) {
      crypto = c as CryptoEntry[]
    }

    res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
    res.status(200).json({ recipientAccounts, crypto } satisfies PaymentConfig)
  } catch {
    res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')
    res.status(200).json(FALLBACK)
  }
}
