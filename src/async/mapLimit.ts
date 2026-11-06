/**
 * Maps `items` with at most `limit` operations running at once.
 * Results stay in the original order. A mapper failure rejects the returned promise.
 *
 * @example await mapLimit(ids, 3, id => fetchUser(id))
 */
export const mapLimit = async <T, R>(
  items: readonly T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R> | R
): Promise<R[]> => {
  if (!Array.isArray(items)) throw new Error('Items must be an array.')
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('Concurrency limit must be a positive integer.')
  }
  if (typeof mapper !== 'function')
    throw new Error('Mapper must be a function.')

  const results = new Array<R>(items.length)
  let nextIndex = 0

  const worker = async (): Promise<void> => {
    while (nextIndex < items.length) {
      const current = nextIndex
      nextIndex += 1
      results[current] = await mapper(items[current] as T, current)
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    worker()
  )
  await Promise.all(workers)
  return results
}
