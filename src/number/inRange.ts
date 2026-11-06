/**
 * Returns true when `value` is inside the inclusive range.
 *
 * @example inRange(5, 1, 5) // true
 */
export const inRange = (value: number, min: number, max: number): boolean => {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(min) ||
    !Number.isFinite(max)
  ) {
    throw new Error('inRange expects finite numbers.')
  }
  if (min > max) throw new Error('min cannot be greater than max.')
  return value >= min && value <= max
}
