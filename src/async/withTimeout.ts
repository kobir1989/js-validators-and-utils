/**
 * Rejects with `message` when `promise` does not settle within `ms` milliseconds.
 * The original rejection is preserved when the promise fails first.
 *
 * @example await withTimeout(fetch('/api'), 1000, 'The request took too long')
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  message = 'Operation timed out'
): Promise<T> => {
  if (!Number.isFinite(ms) || ms < 0) {
    throw new Error('Timeout must be a non-negative number.')
  }

  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(message))
    }, ms)

    promise.then(
      value => {
        clearTimeout(timeoutId)
        resolve(value)
      },
      error => {
        clearTimeout(timeoutId)
        reject(error)
      }
    )
  })
}
