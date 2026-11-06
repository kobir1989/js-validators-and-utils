/**
 * Returns a new object without the named keys.
 *
 * @example omit({ id: 1, password: 'secret' }, ['password'])
 */
export const omit = <T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> => {
  const excluded = new Set<PropertyKey>(keys)
  const result = {} as Omit<T, K>
  ;(Object.keys(object) as Array<keyof T>).forEach(key => {
    if (!excluded.has(key)) {
      ;(result as T)[key] = object[key]
    }
  })
  return result
}
