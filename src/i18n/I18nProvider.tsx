import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  type Locale,
  type Messages,
  translations,
} from './translations'

const STORAGE_KEY = 'veltara-locale'

function readStoredLocale(): Locale {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'en' || s === 'tr') return s
  } catch {
    /* ignore */
  }
  return 'tr'
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((cur, key) => {
    if (cur === null || typeof cur !== 'object') return undefined
    return (cur as Record<string, unknown>)[key]
  }, obj)
}

export function formatTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  )
}

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (path: string) => string
  messages: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    typeof localStorage !== 'undefined' ? readStoredLocale() : 'tr',
  )

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = translations[next].meta.htmlLang
    }
  }, [])

  useEffect(() => {
    const m = translations[locale].meta
    document.documentElement.lang = m.htmlLang
  }, [locale])

  const messages = translations[locale]

  const t = useCallback(
    (path: string) => {
      const v = getByPath(messages, path)
      return typeof v === 'string' ? v : path
    },
    [messages],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, messages }),
    [locale, setLocale, t, messages],
  )

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
