/**
 * Builds a numeric sequence. `end` is exclusive.
 * `range(4)` returns `[0, 1, 2, 3]`. `range(1, 4)` returns `[1, 2, 3]`.
 *
 * @example range(0, 10, 2) // [0, 2, 4, 6, 8]
 */
export const range = (start: number, end?: number, step?: number): number[] => {
  let from = start
  let to = end
  if (to === undefined) {
    to = from
    from = 0
  }
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    throw new Error('Range bounds must be finite numbers.')
  }
  const increment = step ?? (to >= from ? 1 : -1)
  if (!Number.isFinite(increment) || increment === 0) {
    throw new Error('Step cannot be zero.')
  }

  const result: number[] = []
  if (increment > 0) {
    for (let value = from; value < to; value += increment) result.push(value)
  } else {
    for (let value = from; value > to; value += increment) result.push(value)
  }
  return result
}
