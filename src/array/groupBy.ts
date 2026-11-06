/**
 * Groups items by a string or number key. Numeric keys are stored as strings.
 *
 * @example groupBy([{ type: 'a' }, { type: 'b' }], item => item.type)
 */
export const groupBy = <T>(
  array: readonly T[],
  iteratee: (item: T) => string | number
): Record<string, T[]> => {
  const result: Record<string, T[]> = {}
  for (const item of array) {
    const key = String(iteratee(item))
    const bucket = result[key]
    if (bucket) bucket.push(item)
    else result[key] = [item]
  }
  return result
}
