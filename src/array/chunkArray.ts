import { checkArgsArray } from '../internal/checkArgs'

/**
 * Splits an array into groups of `size`. The input is not mutated.
 * The last group contains the remaining items when the length is not divisible.
 *
 * @example chunkArray([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export const chunkArray = <T>(array: readonly T[], size = 1): T[][] => {
  checkArgsArray(array, 'First Argument Should be an Array!')
  if (!Number.isInteger(size) || size < 1) {
    throw new Error('Chunk size must be a positive integer.')
  }

  const result: T[][] = []
  for (let index = 0; index < array.length; index += size) {
    result.push(array.slice(index, index + size))
  }
  return result
}
