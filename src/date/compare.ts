import { toDate } from '../internal/toDate'

const timestamps = (
  left: Date | string | number,
  right: Date | string | number
): [number, number] | null => {
  const start = toDate(left).getTime()
  const end = toDate(right).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return null
  return [start, end]
}

/**
 * Returns true when `left` is strictly earlier than `right`.
 * An invalid date returns false.
 *
 * @example isBefore('2024-01-01', '2024-01-02') // true
 */
export const isBefore = (
  left: Date | string | number,
  right: Date | string | number
): boolean => {
  const times = timestamps(left, right)
  return times !== null && times[0] < times[1]
}

/**
 * Returns true when `left` is strictly later than `right`.
 * An invalid date returns false.
 *
 * @example isAfter('2024-01-02', '2024-01-01') // true
 */
export const isAfter = (
  left: Date | string | number,
  right: Date | string | number
): boolean => {
  const times = timestamps(left, right)
  return times !== null && times[0] > times[1]
}

/**
 * Returns true when both values fall on the same local calendar day.
 * An invalid date returns false.
 *
 * @example isSameDay('2024-05-06T01:00:00', '2024-05-06T23:00:00')
 */
export const isSameDay = (
  left: Date | string | number,
  right: Date | string | number
): boolean => {
  const start = toDate(left)
  const end = toDate(right)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  )
}

/**
 * Returns the number of local calendar days from `from` to `to`.
 * The result is negative when `to` is earlier. Daylight-saving transitions do not change the count.
 *
 * @example diffInDays('2024-03-09', '2024-03-11') // 2
 */
export const diffInDays = (
  from: Date | string | number,
  to: Date | string | number
): number => {
  const start = toDate(from)
  const end = toDate(to)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid date.')
  }
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  )
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((endUtc - startUtc) / 86400000)
}
