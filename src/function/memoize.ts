const defaultKey = (args: unknown[]): string => {
  if (args.length === 1) {
    const arg = args[0]
    const type = typeof arg
    if (
      arg === null ||
      type === 'string' ||
      type === 'number' ||
      type === 'boolean' ||
      type === 'bigint' ||
      type === 'undefined'
    ) {
      return `${type}:${String(arg)}`
    }
  }
  return JSON.stringify(args)
}

/** A memoized function plus the cache used to store results. */
export type MemoizedFunction<A extends unknown[], R> = ((...args: A) => R) & {
  cache: Map<string, R>
}

/**
 * Caches the return value of `func` for a set of arguments.
 * Primitive arguments use a stable key. Objects use `JSON.stringify` unless a resolver is provided.
 *
 * @example
 * const getUser = memoize(async (id: string) => fetchUser(id))
 */
export const memoize = <A extends unknown[], R>(
  func: (...args: A) => R,
  resolver?: (...args: A) => string
): MemoizedFunction<A, R> => {
  if (typeof func !== 'function') throw new Error('Expected a function.')
  const cache = new Map<string, R>()

  const memoized = ((...args: A): R => {
    const key = resolver ? resolver(...args) : defaultKey(args)
    if (cache.has(key)) return cache.get(key) as R
    const result = func(...args)
    cache.set(key, result)
    return result
  }) as MemoizedFunction<A, R>

  memoized.cache = cache
  return memoized
}
