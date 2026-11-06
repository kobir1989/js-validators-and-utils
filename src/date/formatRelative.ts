import { toDate } from '../internal/toDate'

const DIVISIONS: Array<[number, Intl.RelativeTimeFormatUnit]> = [
  [60, 'second'],
  [60, 'minute'],
  [24, 'hour'],
  [7, 'day'],
  [4.34524, 'week'],
  [12, 'month'],
  [Number.POSITIVE_INFINITY, 'year']
]

/**
 * Formats the distance between two dates in English by default.
 * Examples include `5 minutes ago` and `in 2 days`. An invalid date returns `'Invalid Date'`.
 *
 * @example formatRelative('2024-01-01T00:00:00Z', '2024-01-01T00:05:00Z')
 */
export const formatRelative = (
  date: Date | string | number,
  base: Date | string | number = new Date(),
  locale = 'en'
): string => {
  const target = toDate(date)
  const origin = toDate(base)
  if (Number.isNaN(target.getTime()) || Number.isNaN(origin.getTime())) {
    return 'Invalid Date'
  }

  let delta = (target.getTime() - origin.getTime()) / 1000
  let unit: Intl.RelativeTimeFormatUnit = 'second'
  for (const [amount, nextUnit] of DIVISIONS) {
    if (Math.abs(delta) < amount) {
      unit = nextUnit
      break
    }
    delta /= amount
  }
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
    Math.round(delta),
    unit
  )
}
