import { checkArgs } from '../internal/checkArgs'
import { phonesPattern, type PhoneLocale } from './phonesPattern'

export type { PhoneLocale }

/**
 * Validates a phone number against a locale pattern.
 * Pass a string when the number has a leading zero. Numeric input cannot preserve it.
 * Unknown locales return false.
 *
 * @example isValidPhoneNumber('01740000000', 'bn-BD')
 */
export const isValidPhoneNumber = (
  phoneNumber: string | number,
  locale: PhoneLocale | (string & Record<never, never>)
): boolean => {
  let value = phoneNumber
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return false
    value = String(value)
  }
  checkArgs(value, 'string', 'Phone Number Must be string!')
  checkArgs(locale, 'string', 'Locale must be a string!')

  const pattern = phonesPattern[locale as PhoneLocale]
  if (!pattern) return false
  return pattern.test(value.trim())
}
