/**
 * Returns a new object containing only the named keys that exist on `object`.
 *
 * @example pick({ id: 1, name: 'Ada', role: 'admin' }, ['id', 'name'])
 */
export const pick = <T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in object) result[key] = object[key]
  })
  return result
}
