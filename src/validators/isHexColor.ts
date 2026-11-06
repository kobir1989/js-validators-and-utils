import { checkArgs } from '../internal/checkArgs'

/**
 * Returns true for `#RGB`, `#RGBA`, `#RRGGBB`, and `#RRGGBBAA` colors.
 *
 * @example isHexColor('#1a2b3c') // true
 */
export const isHexColor = (value: string): boolean => {
  checkArgs(value, 'string', 'Color must be a string!')
  return /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
}
