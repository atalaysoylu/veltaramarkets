import type { FormCoResult } from './submitFormCo'

type TFn = (path: string) => string

/**
 * FormSubmit.co hata gövdesini kullanıcı dilinde kısa mesaja çevirir.
 */
export function formCoFailureMessage(
  result: Extract<FormCoResult, { ok: false }>,
  t: TFn,
  genericKey: string,
): string {
  const raw = (result.message ?? '').toLowerCase()
  if (raw.includes('activation') || raw.includes('activate form')) {
    return t('form.errSubmitActivation')
  }
  if (raw.includes('web server') || raw.includes('html files')) {
    return t('form.errSubmitNeedServer')
  }
  return t(genericKey)
}
