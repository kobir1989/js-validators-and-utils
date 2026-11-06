import { checkArgs } from '../internal/checkArgs'

/**
 * Checks whether a string is a practical email address.
 * Consecutive dots, missing domains, and surrounding spaces are rejected.
 *
 * @example isValidEmail('user@example.com') // true
 */
export const isValidEmail = (email: string): boolean => {
  checkArgs(email, 'string', 'Email Must be string!')
  if (email.length > 254 || email.includes('..') || /\s/.test(email)) {
    return false
  }

  const pattern =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

  return pattern.test(email)
}
