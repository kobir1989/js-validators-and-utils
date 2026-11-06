import { isBrowser } from './isBrowser'

/** The small storage surface used by the storage helpers. */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const resolveStore = (store?: KeyValueStorage): KeyValueStorage | null => {
  if (store) return store
  if (!isBrowser()) return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Reads and parses a JSON value. Returns `fallback` when the key is missing,
 * the environment has no `localStorage`, or the stored value is not JSON.
 *
 * @example readStorage('theme', 'light')
 */
export const readStorage = <T>(
  key: string,
  fallback?: T,
  store?: KeyValueStorage
): T | undefined => {
  const resolved = resolveStore(store)
  if (!resolved) return fallback
  try {
    const raw = resolved.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/**
 * Serializes `value` as JSON and stores it. Returns false when storage is unavailable
 * or the write fails. Returns true after a successful write.
 *
 * @example writeStorage('theme', 'dark')
 */
export const writeStorage = (
  key: string,
  value: unknown,
  store?: KeyValueStorage
): boolean => {
  const resolved = resolveStore(store)
  if (!resolved) return false
  try {
    resolved.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Removes a key. Does nothing when storage is unavailable.
 *
 * @example removeStorage('theme')
 */
export const removeStorage = (key: string, store?: KeyValueStorage): void => {
  const resolved = resolveStore(store)
  if (!resolved) return
  try {
    resolved.removeItem(key)
  } catch {
    // Private mode and disabled storage should not crash the caller.
  }
}
