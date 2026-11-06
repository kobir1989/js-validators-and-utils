import { checkArgs } from '../internal/checkArgs'

/**
 * Returns true when the value is 13–19 digits and passes the Luhn check.
 * Spaces and dashes are ignored.
 *
 * @example isCreditCard('4242 4242 4242 4242') // true
 */
export const isCreditCard = (value: string): boolean => {
  checkArgs(value, 'string', 'Card number must be a string!')
  const digits = value.replace(/[\s-]/g, '')
  if (!/^\d{13,19}$/.test(digits)) return false

  let sum = 0
  let doubleDigit = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    const char = digits[index]
    if (char === undefined) continue
    let current = char.charCodeAt(0) - 48
    if (doubleDigit) {
      current *= 2
      if (current > 9) current -= 9
    }
    sum += current
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}
