import { useEffect, useState } from 'react'

/**
 * Returns `value` after it has stayed unchanged for `delay` milliseconds.
 * The first render returns the initial value immediately.
 *
 * @example const debouncedQuery = useDebounce(query, 300)
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return debounced
}
