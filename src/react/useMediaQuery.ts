import { useEffect, useState } from 'react'
import { isBrowser } from '../browser/isBrowser'

const matchesQuery = (query: string): boolean => {
  if (!isBrowser()) return false
  return window.matchMedia(query).matches
}

/**
 * Subscribes to a CSS media query. Returns false when `matchMedia` is unavailable,
 * including during server rendering.
 *
 * @example const isWide = useMediaQuery('(min-width: 800px)')
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => matchesQuery(query))

  useEffect(() => {
    if (!isBrowser()) return undefined
    const media = window.matchMedia(query)
    const onChange = (): void => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}
