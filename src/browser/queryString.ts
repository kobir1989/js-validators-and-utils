export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>

/**
 * Parses a query string or a full URL into an object.
 * Repeated keys become arrays. A leading `?` is optional.
 *
 * @example parseQuery('?page=2&tag=js&tag=ts')
 */
export const parseQuery = (
  input: string
): Record<string, string | string[]> => {
  if (typeof input !== 'string') throw new Error('Query must be a string.')
  const queryStart = input.indexOf('?')
  const query = queryStart >= 0 ? input.slice(queryStart + 1) : input
  const hashStart = query.indexOf('#')
  const params = new URLSearchParams(
    hashStart >= 0 ? query.slice(0, hashStart) : query
  )
  const result: Record<string, string | string[]> = {}

  new Set(params.keys()).forEach(key => {
    const values = params.getAll(key)
    const single = values[0]
    result[key] = values.length > 1 ? values : single ?? ''
  })
  return result
}

/**
 * Builds a query string without a leading `?`.
 * `null` and `undefined` values are omitted. Arrays repeat the key.
 *
 * @example stringifyQuery({ page: 2, tag: ['js', 'ts'] }) // 'page=2&tag=js&tag=ts'
 */
export const stringifyQuery = (params: Record<string, QueryValue>): string => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return
    if (Array.isArray(value)) {
      value.forEach(item => search.append(key, String(item)))
      return
    }
    search.append(key, String(value))
  })
  return search.toString()
}
