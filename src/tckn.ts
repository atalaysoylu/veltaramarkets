/** Rakam dışını atar; en fazla 11 rakam döner (TCKN). */
export function normalizeTcknDigits(input: string): string {
  return input.replace(/\D/g, '').slice(0, 11)
}

/** Türkiye Cumhuriyeti Kimlik Numarası doğrulama (11 haneli kontrol kuralları). */
export function isValidTckn(digits: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(digits)) return false

  const d = [...digits].map((c) => Number.parseInt(c, 10))

  const oddSum = d[0]! + d[2]! + d[4]! + d[6]! + d[8]!
  const evenSum = d[1]! + d[3]! + d[5]! + d[7]!
  const tenth = (((oddSum * 7 - evenSum) % 10) + 10) % 10
  if (tenth !== d[9]!) return false

  const sumFirst10 = d.slice(0, 10).reduce((a, b) => a + b, 0)
  return sumFirst10 % 10 === d[10]
}
