import { checkArgs } from '../internal/checkArgs'

/**
 * Returns true when the string can be parsed with `JSON.parse`.
 *
 * @example isValidJSON('{"ok":true}') // true
 */
export const isValidJSON = (value: string): boolean => {
  checkArgs(value, 'string', 'JSON value must be a string!')
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}
