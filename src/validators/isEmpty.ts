/**
 * Returns true for null, undefined, empty strings, empty arrays, empty maps,
 * empty sets, and objects without own keys. `0` and `false` are not empty.
 *
 * @example isEmpty([]) // true
 */
export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
