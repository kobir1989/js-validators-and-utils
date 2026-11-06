/**
 * Resolves after `ms` milliseconds.
 *
 * @example await sleep(250)
 */
export const sleep = (ms: number): Promise<void> => {
  if (!Number.isFinite(ms) || ms < 0) {
    throw new Error('Delay must be a non-negative number.')
  }
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
