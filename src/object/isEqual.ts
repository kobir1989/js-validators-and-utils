const equals = (
  left: unknown,
  right: unknown,
  seen: WeakMap<object, object>
): boolean => {
  if (left === right || (Number.isNaN(left) && Number.isNaN(right))) return true
  if (typeof left !== 'object' || typeof right !== 'object') return false
  if (left === null || right === null) return false
  if (seen.get(left) === right) return true
  seen.set(left, right)

  if (left instanceof Date || right instanceof Date) {
    return (
      left instanceof Date &&
      right instanceof Date &&
      left.getTime() === right.getTime()
    )
  }
  if (left instanceof RegExp || right instanceof RegExp) {
    return (
      left instanceof RegExp &&
      right instanceof RegExp &&
      left.source === right.source &&
      left.flags === right.flags
    )
  }
  if (left instanceof Map || right instanceof Map) {
    if (!(left instanceof Map) || !(right instanceof Map)) return false
    if (left.size !== right.size) return false
    const unused = [...right]
    for (const [key, value] of left) {
      const index = unused.findIndex(
        ([candidateKey, candidateValue]) =>
          equals(key, candidateKey, seen) && equals(value, candidateValue, seen)
      )
      if (index < 0) return false
      unused.splice(index, 1)
    }
    return true
  }
  if (left instanceof Set || right instanceof Set) {
    if (!(left instanceof Set) || !(right instanceof Set)) return false
    if (left.size !== right.size) return false
    const unused = [...right]
    for (const value of left) {
      const index = unused.findIndex(candidate =>
        equals(value, candidate, seen)
      )
      if (index < 0) return false
      unused.splice(index, 1)
    }
    return true
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false
    if (left.length !== right.length) return false
    return left.every((item, index) => equals(item, right[index], seen))
  }

  const leftKeys = Object.keys(left)
  const rightRecord = right as Record<string, unknown>
  const leftRecord = left as Record<string, unknown>
  if (leftKeys.length !== Object.keys(rightRecord).length) return false
  return leftKeys.every(
    key =>
      Object.prototype.hasOwnProperty.call(rightRecord, key) &&
      equals(leftRecord[key], rightRecord[key], seen)
  )
}

/**
 * Deeply compares plain data. `NaN` equals `NaN`, and `0` equals `-0`.
 * Dates compare by time. Regular expressions compare by source and flags.
 *
 * @example isEqual({ a: [1] }, { a: [1] }) // true
 */
export const isEqual = (left: unknown, right: unknown): boolean => {
  return equals(left, right, new WeakMap())
}
