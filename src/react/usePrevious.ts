import { useRef } from 'react'

/**
 * Returns the value from the previous render. The first render returns `undefined`.
 *
 * @example const previous = usePrevious(count)
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined)
  const previous = ref.current
  ref.current = value
  return previous
}
