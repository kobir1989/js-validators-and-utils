/** A debounced function with `cancel` and `flush` controls. */
export interface DebouncedFunction<A extends unknown[]> {
  (...args: A): void
  /** Drops a pending call. */
  cancel: () => void
  /** Runs a pending call immediately. */
  flush: () => void
}

/**
 * Returns a function that waits until `delay` milliseconds have passed
 * since its last call, then invokes `func` with the latest arguments and `this`.
 *
 * @example
 * const save = debounce((value: string) => persist(value), 300)
 */
export const debounce = <A extends unknown[]>(
  func: (...args: A) => unknown,
  delay = 300
): DebouncedFunction<A> => {
  if (typeof func !== 'function') throw new Error('Expected a function.')
  if (!Number.isFinite(delay) || delay < 0) {
    throw new Error('Delay must be a non-negative number.')
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: A | undefined
  let lastThis: unknown

  const invoke = (): void => {
    const args = lastArgs
    const context = lastThis
    lastArgs = undefined
    lastThis = undefined
    timeoutId = undefined
    if (args) func.apply(context, args)
  }

  const debounced = function (this: unknown, ...args: A): void {
    lastArgs = args
    // The timer callback needs the receiver from this call.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = setTimeout(invoke, delay)
  } as DebouncedFunction<A>

  debounced.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
    lastArgs = undefined
    lastThis = undefined
  }

  debounced.flush = () => {
    if (timeoutId === undefined) return
    clearTimeout(timeoutId)
    invoke()
  }

  return debounced
}
