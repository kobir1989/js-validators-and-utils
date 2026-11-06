const assertFinite = (value: number, label: string): void => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`)
  }
}

/**
 * Restricts `value` to the inclusive range from `min` to `max`.
 *
 * @example clamp(12, 0, 10) // 10
 */
export const clamp = (value: number, min: number, max: number): number => {
  assertFinite(value, 'Value')
  assertFinite(min, 'Min')
  assertFinite(max, 'Max')
  if (min > max) throw new Error('min cannot be greater than max.')
  return Math.min(max, Math.max(min, value))
}
