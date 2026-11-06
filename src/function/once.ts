/**
 * Returns a function that invokes `func` only on its first call and then returns that result.
 *
 * @example
 * const initialize = once(() => createConnection())
 */
export const once = <A extends unknown[], R>(
  func: (...args: A) => R
): ((...args: A) => R) => {
  if (typeof func !== 'function') throw new Error('Expected a function.')
  let called = false
  let result: R | undefined

  return function (this: unknown, ...args: A): R {
    if (!called) {
      called = true
      result = func.apply(this, args) as R
    }
    return result as R
  }
}
