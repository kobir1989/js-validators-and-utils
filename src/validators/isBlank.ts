/**
 * Returns true when the value is not a string or contains only whitespace.
 * Useful for required form fields.
 *
 * @example isBlank('   ') // true
 */
export const isBlank = (value: unknown): boolean => {
  return typeof value !== 'string' || value.trim().length === 0
}
