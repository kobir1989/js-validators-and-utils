const tokenize = (path: string): string[] => {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(key => key.length > 0)
}

/**
 * Reads a nested value by a dot or bracket path.
 * Returns `fallback` when any part of the path is missing or `undefined`.
 * `null` is returned as a real value.
 *
 * @example getPath({ user: { name: 'Ada' } }, 'user.name', 'Guest')
 */
export const getPath = <T = unknown>(
  input: unknown,
  path: string,
  fallback?: T
): T | undefined => {
  if (path.trim() === '') return input as T
  let current: unknown = input
  for (const key of tokenize(path)) {
    if (current == null || typeof current !== 'object') return fallback
    current = (current as Record<string, unknown>)[key]
  }
  return current === undefined ? fallback : (current as T)
}
