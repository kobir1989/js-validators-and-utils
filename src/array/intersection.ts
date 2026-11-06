import { unique } from './unique'

/**
 * Returns unique items that are present in every array, in the order of the first array.
 *
 * @example intersection([1, 2, 2], [2, 3], [2, 4]) // [2]
 */
export const intersection = <T>(...arrays: Array<readonly T[]>): T[] => {
  const [first, ...rest] = arrays
  if (!first) return []
  return unique(first).filter(item => rest.every(array => array.includes(item)))
}
