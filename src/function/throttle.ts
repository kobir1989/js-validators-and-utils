/** A throttled function with a `cancel` control. */
export interface ThrottledFunction<A extends unknown[]> {
  (...args: A): void
  /** Drops a pending trailing call and resets the timer. */
  cancel: () => void
}

export interface ThrottleOptions {
  /** Invoke on the first call in a window. Defaults to true. */
  leading?: boolean
  /** Invoke once more after the window when calls were ignored. Defaults to true. */
  trailing?: boolean
}

/**
 * Invokes `func` at most once per `wait` milliseconds.
 * Later calls in the window are remembered and can run once when it ends.
 *
 * @example
 * const onScroll = throttle(() => updatePosition(), 100)
 */
export const throttle = <A extends unknown[]>(
  func: (...args: A) => unknown,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<A> => {
  if (typeof func !== 'function') throw new Error('Expected a function.')
  if (!Number.isFinite(wait) || wait < 0) {
    throw new Error('Wait must be a non-negative number.')
  }

  const leading = options.leading !== false
  const trailing = options.trailing !== false
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: A | undefined
  let lastThis: unknown
  let lastInvoke = 0

  const invoke = (time: number): void => {
    lastInvoke = time
    const args = lastArgs
    const context = lastThis
    lastArgs = undefined
    lastThis = undefined
    if (args) func.apply(context, args)
  }

  const trailingEdge = (): void => {
    timeoutId = undefined
    if (trailing && lastArgs) invoke(Date.now())
  }

  const throttled = function (this: unknown, ...args: A): void {
    const now = Date.now()
    if (!lastInvoke && !leading) lastInvoke = now
    const remaining = wait - (now - lastInvoke)
    lastArgs = args
    // The timer callback needs the receiver from this call.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
      invoke(now)
      return
    }

    if (timeoutId === undefined && trailing) {
      timeoutId = setTimeout(trailingEdge, remaining)
    }
  } as ThrottledFunction<A>

  throttled.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
    lastInvoke = 0
    lastArgs = undefined
    lastThis = undefined
  }

  return throttled
}
