import { useCallback, useEffect, useState } from 'react'
import { isBrowser } from '../browser/isBrowser'

/**
 * Keeps state in `localStorage` as JSON.
 * The stored value is read after mount so server rendering can use `initialValue`.
 * Values must be JSON-serializable. The third function removes the key and restores
 * `initialValue`.
 *
 * @example const [theme, setTheme, clearTheme] = useLocalStorage('theme', 'light')
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((current: T) => T)) => void, () => void] => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (!isBrowser()) return
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) setValue(JSON.parse(raw) as T)
    } catch {
      // Keep the initial value when storage is blocked or the JSON is invalid.
    }
  }, [key])

  const setStoredValue = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue(current => {
        const resolved =
          typeof next === 'function'
            ? (next as (current: T) => T)(current)
            : next
        if (isBrowser()) {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved))
          } catch {
            // Ignore quota and privacy errors.
          }
        }
        return resolved
      })
    },
    [key]
  )

  const remove = useCallback(() => {
    if (isBrowser()) {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Ignore storage failures.
      }
    }
    setValue(initialValue)
  }, [initialValue, key])

  return [value, setStoredValue, remove]
}
