import { isPlainObject } from '../internal/isPlainObject'
import { deepClone } from './deepClone'

/**
 * Merges plain objects from left to right without mutating them.
 * Nested plain objects are merged. Arrays and other values are replaced.
 * `undefined` properties are skipped, so a later object can leave an earlier value in place.
 *
 * @example deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 */
export function deepMerge<A extends Record<string, unknown>>(source: A): A
export function deepMerge<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>
>(first: A | null | undefined, second: B | null | undefined): A & B
export function deepMerge<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>,
  C extends Record<string, unknown>
>(
  first: A | null | undefined,
  second: B | null | undefined,
  third: C | null | undefined
): A & B & C
export function deepMerge(
  ...sources: Array<Record<string, unknown> | null | undefined>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  sources.forEach(source => {
    if (!isPlainObject(source)) return
    Object.keys(source).forEach(key => {
      const value = source[key]
      if (value === undefined) return
      const existing = result[key]
      if (isPlainObject(existing) && isPlainObject(value)) {
        result[key] = deepMerge(existing, value)
        return
      }
      result[key] = deepClone(value)
    })
  })

  return result
}
