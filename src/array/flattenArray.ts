import { checkArgsArray } from '../internal/checkArgs'

/**
 * Flattens nested arrays up to `depth` levels.
 * A depth of `0` or less returns the same array reference. An empty array does too.
 *
 * @example flattenArray([1, [2, [3, [4]]]], 2) // [1, 2, 3, [4]]
 */
export const flattenArray = <T>(array: readonly T[], depth: number): T[] => {
  checkArgsArray(array, 'First Argument should ba an Array!')
  if (depth <= 0 || array.length === 0) return array as T[]

  const result: T[] = []
  for (const item of array) {
    if (depth > 0 && Array.isArray(item)) {
      result.push(...flattenArray(item as T[], depth - 1))
    } else {
      result.push(item)
    }
  }
  return result
}
