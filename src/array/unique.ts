/**
 * Returns the first occurrence of each value. Objects are compared by reference
 * unless `iteratee` returns a comparison key.
 *
 * @example unique([{ id: 1 }, { id: 1 }], item => item.id)
 */
export const unique = <T>(
  array: readonly T[],
  iteratee?: (item: T) => unknown
): T[] => {
  const seen = new Set<unknown>()
  const result: T[] = []
  for (const item of array) {
    const key = iteratee ? iteratee(item) : item
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }
  return result
}
