import { checkArgs } from '../lib/checkArgs'
import { phonesPattern } from '../staticData/phonesPattern'

/**
 * @function isValidPhoneNumber
 * @param {phoneNumber} string | number
 * @returns {boolean}
 */
export const isValidPhoneNumber = (
  phoneNumber: string,
  locale: string
): boolean => {
  checkArgs(phoneNumber, 'string', 'Phone Number Must be string!')
  // Convert the phoneNumber to a string for validation
  phoneNumber = phoneNumber.toString().trim()

  // Check if the provided locale exists in the phonesPattern
  // eslint-disable-next-line no-prototype-builtins
  if (phonesPattern.hasOwnProperty(locale)) {
    const regex = phonesPattern[locale]
    // Test if the phoneNumber matches the pattern
    return regex.test(phoneNumber)
  }

  return false
}
