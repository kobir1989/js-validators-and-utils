export interface RetryOptions {
  /**
   * Called after a failed attempt. Defaults to writing the attempt to `console.error`,
   * which is the historical behavior.
   */
  onError?: (error: unknown, attempt: number) => void
}

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

/**
 * Runs `operation` until it resolves or `maxRetries` attempts have been used.
 * `maxRetries` is the total number of attempts, not the number of extra tries.
 *
 * @example await retry(() => fetch('/api'), 3, 200)
 */
export const retry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number,
  delayMs: number,
  options: RetryOptions = {}
): Promise<T> => {
  if (typeof operation !== 'function') {
    throw new Error('Operation must be a function.')
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 1) {
    throw new Error('maxRetries must be a positive integer.')
  }
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error('delayMs must be a non-negative number.')
  }

  const onError =
    options.onError ??
    ((error: unknown, attempt: number) => {
      console.error(`Attempt ${attempt} failed: ${errorMessage(error)}`)
    })

  let attempt = 0
  while (attempt < maxRetries) {
    try {
      return await operation()
    } catch (error: unknown) {
      attempt += 1
      onError(error, attempt)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }

  throw new Error(`Operation failed after ${maxRetries} retries`)
}
