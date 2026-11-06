const compareKeys = (left: unknown, right: unknown): number => {
  const leftMissing =
    left == null || (typeof left === 'number' && Number.isNaN(left))
  const rightMissing =
    right == null || (typeof right === 'number' && Number.isNaN(right))
  if (leftMissing && rightMissing) return 0
  if (leftMissing) return 1
  if (rightMissing) return -1
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime()
  }
  if (typeof left === 'number' && typeof right === 'number') return left - right
  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return Number(left) - Number(right)
  }
  return String(left).localeCompare(String(right))
}

/**
 * Returns a new array sorted by `iteratee`. The input is not mutated.
 * Missing and `NaN` keys are placed last. Equal keys keep their original order.
 *
 * @example sortBy([{ n: 2 }, { n: 1 }], item => item.n)
 */
export const sortBy = <T>(
  array: readonly T[],
  iteratee: (item: T) => string | number | boolean | Date | null | undefined
): T[] => {
  return array
    .map((item, index) => ({ item, index, key: iteratee(item) }))
    .sort((left, right) => {
      const compared = compareKeys(left.key, right.key)
      return compared === 0 ? left.index - right.index : compared
    })
    .map(entry => entry.item)
}
