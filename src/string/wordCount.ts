import { checkArgs } from '../internal/checkArgs'

/**
 * Counts words separated by whitespace. A blank string has a count of 0.
 *
 * @example wordCount('one two  three') // 3
 */
export const wordCount = (value: string): number => {
  checkArgs(value, 'string', 'Argument should be a string')
  const trimmed = value.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}
