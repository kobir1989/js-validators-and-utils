/**
 * Splits an array into items that match the predicate and items that do not.
 *
 * @example partition([1, 2, 3, 4], n => n % 2 === 0) // [[2, 4], [1, 3]]
 */
export const partition = <T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] => {
  const matched: T[] = []
  const rest: T[] = []
  array.forEach((item, index) => {
    if (predicate(item, index)) matched.push(item)
    else rest.push(item)
  })
  return [matched, rest]
}
