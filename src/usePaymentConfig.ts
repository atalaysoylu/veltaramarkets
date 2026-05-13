import { useEffect, useState } from 'react'
import {
  FALLBACK_PAYMENT_CONFIG,
  normalizePaymentConfig,
  type PaymentConfig,
} from './paymentConfig'

export function usePaymentConfig(): PaymentConfig {
  const [config, setConfig] = useState<PaymentConfig>(FALLBACK_PAYMENT_CONFIG)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/payment-config', {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad_status'))))
      .then((data: unknown) => {
        const normalized = normalizePaymentConfig(data)
        if (normalized) setConfig(normalized)
      })
      .catch(() => {
        /* fallback */
      })
    return () => controller.abort()
  }, [])

  return config
}
