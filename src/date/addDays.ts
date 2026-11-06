import { isValidDateInput, toDate } from '../internal/toDate'

/**
 * Returns a new date shifted by `amount` calendar days. The input is not mutated.
 *
 * @example addDays('2024-01-31', 1)
 */
export const addDays = (date: Date | string | number, amount: number): Date => {
  if (!isValidDateInput(date)) throw new Error('Invalid date.')
  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a finite number.')
  }
  const result = toDate(date)
  result.setDate(result.getDate() + amount)
  return result
}
