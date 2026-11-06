import { checkArgs } from '../internal/checkArgs'

/**
 * Returns a slice of the trimmed string from `start` to `end`.
 * An ellipsis is added when the trimmed string is longer than `end`.
 * When `start` is past the end of the original string, the original string is returned.
 *
 * @example truncatedString('This is a long sentence that needs to be truncated.')
 */
export const truncatedString = (value: string, start = 0, end = 30): string => {
  checkArgs(value, 'string', 'Argument should be a String!')
  checkArgs(start, 'number', 'Argument should be a Number!')
  checkArgs(end, 'number', 'Argument should be a Number!')
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new Error('Start and end must be finite numbers.')
  }

  const trimmed = value.trim()
  if (trimmed === '' || start >= end) return trimmed
  if (start >= value.length) return value
  if (value.length <= end) return trimmed.slice(start, value.length)
  return `${trimmed.slice(start, end)}...`
}
