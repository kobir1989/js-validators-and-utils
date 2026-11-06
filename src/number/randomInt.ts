/**
 * Returns a random integer from `min` through `max`, including both ends.
 * Pass `random` to supply a deterministic source in tests.
 *
 * @example randomInt(1, 6)
 */
export const randomInt = (
  min: number,
  max: number,
  random: () => number = Math.random
): number => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('min and max must be integers.')
  }
  if (max < min) throw new Error('max must be greater than or equal to min.')
  if (typeof random !== 'function') {
    throw new Error('Random source must be a function.')
  }
  return min + Math.floor(random() * (max - min + 1))
}
