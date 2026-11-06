import { checkArgs } from '../internal/checkArgs'

/**
 * Returns true when `date` is a real calendar day in `YYYY-MM-DD` form.
 * Month and day overflow, such as `2023-02-31`, is rejected.
 *
 * @example isValidDate('2024-02-29') // true
 */
export const isValidDate = (date: string): boolean => {
  checkArgs(
    date,
    'string',
    'Invalid date format. Please provide a date string (e.g., "2023-09-05").'
  )

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const yearText = match?.[1]
  const monthText = match?.[2]
  const dayText = match?.[3]
  if (!yearText || !monthText || !dayText) return false

  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const parsed = new Date(Date.UTC(year, month - 1, day))

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}
