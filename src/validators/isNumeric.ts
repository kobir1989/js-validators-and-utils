/**
 * Returns true for finite numbers and strings that parse as finite numbers.
 * Blank strings, `Infinity`, and `NaN` return false.
 *
 * @example isNumeric('12.5') // true
 */
export const isNumeric = (value: unknown): boolean => {
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'string' || value.trim() === '') return false
  return Number.isFinite(Number(value))
}

/**
 * Returns true only for finite integer numbers, not numeric strings.
 *
 * @example isInteger(3) // true
 */
export const isInteger = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isInteger(value)
}
