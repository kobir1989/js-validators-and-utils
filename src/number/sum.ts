const assertNumbers = (values: readonly number[]): void => {
  if (!Array.isArray(values) || values.some(value => !Number.isFinite(value))) {
    throw new Error('Expected an array of finite numbers.')
  }
}

/**
 * Adds finite numbers. An empty array sums to 0.
 *
 * @example sum([1, 2, 3]) // 6
 */
export const sum = (values: readonly number[]): number => {
  assertNumbers(values)
  return values.reduce((total, value) => total + value, 0)
}

/**
 * Returns the arithmetic mean of a non-empty list of finite numbers.
 *
 * @example average([2, 4]) // 3
 */
export const average = (values: readonly number[]): number => {
  assertNumbers(values)
  if (values.length === 0) throw new Error('Cannot average an empty list.')
  return sum(values) / values.length
}
