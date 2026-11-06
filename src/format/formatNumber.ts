/**
 * Formats a finite number with `Intl.NumberFormat`.
 *
 * @example formatNumber(1234.5, 'en-US') // '1,234.5'
 */
export const formatNumber = (
  value: number,
  locale = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Value must be a finite number.')
  }
  return new Intl.NumberFormat(locale, options).format(value)
}

/**
 * Formats a finite number as currency.
 *
 * @example formatCurrency(12.5, 'USD', 'en-US') // '$12.50'
 */
export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Value must be a finite number.')
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    value
  )
}
