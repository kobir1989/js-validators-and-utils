/**
 * Removes `null` and `undefined` values. `0`, `false`, and empty strings are kept.
 *
 * @example compact([0, null, 1, undefined, false]) // [0, 1, false]
 */
export const compact = <T>(array: readonly (T | null | undefined)[]): T[] => {
  return array.filter((item): item is T => item != null)
}
