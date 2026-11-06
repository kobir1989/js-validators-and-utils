import { isValidDateInput, toDate } from '../internal/toDate'

/**
 * Returns a new date at 00:00:00.000 in the local timezone.
 *
 * @example startOfDay('2024-05-06T15:30:00')
 */
export const startOfDay = (date: Date | string | number): Date => {
  if (!isValidDateInput(date)) throw new Error('Invalid date.')
  const result = toDate(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Returns a new date at 23:59:59.999 in the local timezone.
 *
 * @example endOfDay('2024-05-06T15:30:00')
 */
export const endOfDay = (date: Date | string | number): Date => {
  if (!isValidDateInput(date)) throw new Error('Invalid date.')
  const result = toDate(date)
  result.setHours(23, 59, 59, 999)
  return result
}
