import { useEffect, useRef } from 'react'

/**
 * Subscribes to a DOM event and always calls the latest handler.
 * The default target is `window`. Passing `null` skips the subscription.
 *
 * @example useEventListener('resize', () => measure())
 */
export const useEventListener = <K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: EventTarget | null
): void => {
  const saved = useRef(handler)

  useEffect(() => {
    saved.current = handler
  }, [handler])

  useEffect(() => {
    const element = target === undefined ? window : target
    if (!element?.addEventListener) return undefined

    const listener = (nativeEvent: Event): void => {
      saved.current(nativeEvent as WindowEventMap[K])
    }
    element.addEventListener(event, listener)
    return () => element.removeEventListener(event, listener)
  }, [event, target])
}
