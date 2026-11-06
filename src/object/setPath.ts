import { deepClone } from './deepClone'
import { isPlainObject } from '../internal/isPlainObject'

const tokenize = (path: string): string[] => {
  return path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(key => key.length > 0)
}

/**
 * Returns a copy of `input` with `value` written at `path`.
 * The original value is not mutated. Missing objects and arrays are created.
 *
 * @example setPath({ user: { name: 'Ada' } }, 'user.name', 'Grace')
 */
export const setPath = <T>(input: T, path: string, value: unknown): T => {
  const keys = tokenize(path)
  if (keys.length === 0) return deepClone(value) as T

  const cloned = deepClone(input)
  const root: unknown =
    cloned !== null && typeof cloned === 'object'
      ? cloned
      : /^\d+$/.test(keys[0] ?? '')
      ? []
      : {}
  let current = root as Record<string, unknown>

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value
      return
    }
    const next = current[key]
    const nextKey = keys[index + 1] ?? ''
    if (Array.isArray(next) || isPlainObject(next)) {
      current = next as Record<string, unknown>
      return
    }
    const replacement: unknown[] | Record<string, unknown> = /^\d+$/.test(
      nextKey
    )
      ? []
      : {}
    current[key] = replacement
    current = replacement as Record<string, unknown>
  })

  return root as T
}
