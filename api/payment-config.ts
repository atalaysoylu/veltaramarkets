/**
 * Ödeme (havale IBAN listesi + kripto adresleri) — Vercel üzerinden yönetim
 *
 * 1) Ortam değişkeni (Projeyi yeniden deploy etmeden Güncellenir → Vercel → Settings → Environment Variables):
 *    PAYMENT_CONFIG_JSON = tek satır JSON, örn:
 *    {"recipientAccounts":[{"holder":"...","bank":"Yapı Kredi","iban":"TR…","swift":""}],
 *      "crypto":[{"label":"USDT (TRC20)","address":"T…"}]}
 *
 * 2) Edge Config (Store’u projeye bağlayın → Vercel Dashboard):
 *    - recipientAccounts → dizi (veya dizinin JSON string hali)
 *    - crypto → dizi (veya string JSON)
 *    - VEYA tek anahtar: paymentConfig → { recipientAccounts, crypto } nesnesi ya da bunun JSON string’i
 *    - Geriye uyum: tek alıcı için iban + holder + bank (+ swift)
 *
 * Öncelik: PAYMENT_CONFIG_JSON dolu ise o kullanılır; değilse Edge Config; hata/yok ise kod içi FALLBACK.
 */

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
  id?: string
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

function unwrapEmbeddedPaymentConfig(pc: unknown): Record<string, unknown> | null {
  if (!pc || pc === null) return null
  if (typeof pc === 'string') {
    const t = pc.trim()
    if (!t) return null
    try {
      const j = JSON.parse(t) as unknown
      return j && typeof j === 'object' && !Array.isArray(j) ? (j as Record<string, unknown>) : null
    } catch {
      return null
    }
  }
  if (typeof pc === 'object' && !Array.isArray(pc)) return pc as Record<string, unknown>
  return null
}

function parseFlexibleArray(raw: unknown): unknown[] | null {
  if (Array.isArray(raw)) return raw
  if (typeof raw !== 'string') return null
  const t = raw.trim()
  if (!t) return null
  try {
    const j = JSON.parse(t) as unknown
    return Array.isArray(j) ? j : null
  } catch {
    return null
  }
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

function flattenEdgeRoot(all: Record<string, unknown>): Record<string, unknown> {
  const embedded =
    unwrapEmbeddedPaymentConfig(all.paymentConfig) ??
    unwrapEmbeddedPaymentConfig(all.PAYMENT_CONFIG)
  if (!embedded) return { ...all }
  return { ...all, ...embedded }
}

function parseRecipientAccountsUnified(root: Record<string, unknown>): IbanInfo[] {
  const r = flattenEdgeRoot(root)

  const fromArrays: unknown[] = [r.recipientAccounts]
  for (const cand of fromArrays) {
    const arr = parseFlexibleArray(cand)
    if (arr?.length) {
      const list = arr.map(parseIban).filter((x): x is IbanInfo => x !== null)
      if (list.length) return list
    }
  }

  const one = parseIban(r.iban)
  return one ? [one] : []
}

function parseCryptoEntry(raw: unknown): CryptoEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const v = raw as Record<string, unknown>
  if (typeof v.label !== 'string' || typeof v.address !== 'string') return null
  const id = typeof v.id === 'string' && v.id.trim() ? v.id : undefined
  return { ...(id ? { id } : {}), label: v.label, address: v.address }
}

function parseCryptoUnified(root: Record<string, unknown>): CryptoEntry[] {
  const r = flattenEdgeRoot(root)
  const arr = parseFlexibleArray(r.crypto)
  if (!arr?.length) return []
  return arr.map(parseCryptoEntry).filter((x): x is CryptoEntry => x !== null)
}

function finalizeConfig(partialRecipients: IbanInfo[], partialCrypto: CryptoEntry[]): PaymentConfig {
  return {
    recipientAccounts:
      partialRecipients.length > 0 ? partialRecipients : FALLBACK.recipientAccounts,
    crypto: partialCrypto.length > 0 ? partialCrypto : FALLBACK.crypto,
  }
}

function readPaymentConfigFromEnv(): PaymentConfig | null {
  const raw = process.env.PAYMENT_CONFIG_JSON?.trim()
  if (!raw) return null
  try {
    const o = JSON.parse(raw) as unknown
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null
    const root = o as Record<string, unknown>
    return finalizeConfig(parseRecipientAccountsUnified(root), parseCryptoUnified(root))
  } catch {
    return null
  }
}

async function readPaymentConfigFromEdge(): Promise<PaymentConfig> {
  const all = (await getAll()) as Record<string, unknown>
  const recipients = parseRecipientAccountsUnified(all)
  const crypto = parseCryptoUnified(all)
  return finalizeConfig(recipients, crypto)
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')

  const fromEnv = readPaymentConfigFromEnv()
  if (fromEnv) {
    res.status(200).json(fromEnv)
    return
  }

  try {
    const resolved = await readPaymentConfigFromEdge()
    const body: PaymentConfig = resolved
    res.status(200).json(body)
  } catch {
    res.status(200).json(FALLBACK)
  }
}
