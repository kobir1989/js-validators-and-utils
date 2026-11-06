/**
 * Rounds a number to a fixed number of decimal places.
 * Negative numbers are rounded away from zero on exact halves, unlike `Math.round`.
 *
 * @example roundTo(1.005, 2) // 1.01
 */
export const roundTo = (value: number, decimals = 0): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Value must be a finite number.')
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 15) {
    throw new Error('Decimals must be an integer between 0 and 15.')
  }
  const sign = value < 0 ? -1 : 1
  const shifted = Number(`${Math.abs(value)}e${decimals}`)
  const rounded = Math.round(shifted)
  return sign * Number(`${rounded}e-${decimals}`)
}
