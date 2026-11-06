/**
 * Returns items from the first array that are not included in any later array.
 * Comparison uses SameValueZero, so `NaN` matches `NaN`.
 *
 * @example difference([1, 2, 3], [2], [3]) // [1]
 */
export const difference = <T>(
  array: readonly T[],
  ...others: Array<readonly T[]>
): T[] => {
  const excluded = new Set<T>(others.flat())
  return array.filter(item => !excluded.has(item))
}
