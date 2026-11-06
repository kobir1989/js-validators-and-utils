import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a function that reports whether the component is currently mounted.
 * Use it before setting state after an async call.
 *
 * @example
 * const mounted = useIsMounted()
 * if (mounted()) setData(data)
 */
export const useIsMounted = (): (() => boolean) => {
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return useCallback(() => mounted.current, [])
}
