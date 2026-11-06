import { checkArgsArray } from '../internal/checkArgs'

/**
 * Returns a new array with the same items in random order.
 * The input is not mutated. Pass `random` to supply a deterministic source in tests.
 *
 * @example shuffleArray([1, 2, 3, 4])
 */
export const shuffleArray = <T>(
  array: readonly T[],
  random: () => number = Math.random
): T[] => {
  checkArgsArray(array, 'Argument should be an Array!')
  if (typeof random !== 'function') {
    throw new Error('Random source must be a function.')
  }

  const result = [...array]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = result[index]
    const swap = result[swapIndex]
    if (current !== undefined && swap !== undefined) {
      result[index] = swap
      result[swapIndex] = current
    }
  }
  return result
}
