import { isValidDateInput, toDate } from '../internal/toDate'

/**
 * Returns a new date shifted by `amount` calendar months.
 * The day is clamped to the last day of the target month, so January 31 plus one month
 * lands on February 28 or February 29.
 *
 * @example addMonths('2024-01-31', 1)
 */
export const addMonths = (
  date: Date | string | number,
  amount: number
): Date => {
  if (!isValidDateInput(date)) throw new Error('Invalid date.')
  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a finite number.')
  }
  const source = toDate(date)
  const day = source.getDate()
  const result = toDate(source)
  result.setDate(1)
  result.setMonth(result.getMonth() + amount)
  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate()
  result.setDate(Math.min(day, lastDay))
  return result
}
