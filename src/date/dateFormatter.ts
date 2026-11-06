import { checkArgs } from '../internal/checkArgs'

/**
 * Formats a date string with `Intl.DateTimeFormat`.
 * An empty string is returned unchanged. An unparseable date returns `'Invalid Date'`.
 * A locale or options object rejected by `Intl` returns `'Invalid Date format'`.
 *
 * @example dateFormatter('2023-09-06T14:30:00') // 'September 6, 2023'
 */
export const dateFormatter = (
  date: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  locale = 'en-US'
): string => {
  checkArgs(date, 'string', 'Date must be a String!')
  checkArgs(options, 'object', 'Options must be object with key value pair!')
  checkArgs(locale, 'string', 'Argument must be a string!')
  if (date.trim() === '') return date

  try {
    return new Date(date).toLocaleDateString(locale, options)
  } catch {
    return 'Invalid Date format'
  }
}
