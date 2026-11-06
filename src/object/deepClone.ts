import { isPlainObject } from '../internal/isPlainObject'

const cloneValue = <T>(value: T, seen: WeakMap<object, unknown>): T => {
  if (typeof value !== 'object' || value === null) return value
  if (seen.has(value)) return seen.get(value) as T

  if (value instanceof Date) return new Date(value.getTime()) as T
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T
  }

  if (value instanceof Map) {
    const copy = new Map()
    seen.set(value, copy)
    value.forEach((entry, key) => {
      copy.set(cloneValue(key, seen), cloneValue(entry, seen))
    })
    return copy as T
  }

  if (value instanceof Set) {
    const copy = new Set()
    seen.set(value, copy)
    value.forEach(entry => {
      copy.add(cloneValue(entry, seen))
    })
    return copy as T
  }

  if (Array.isArray(value)) {
    const copy: unknown[] = []
    seen.set(value, copy)
    value.forEach(entry => {
      copy.push(cloneValue(entry, seen))
    })
    return copy as T
  }

  if (!isPlainObject(value)) return value

  const copy: Record<string, unknown> = {}
  seen.set(value, copy)
  Object.keys(value).forEach(key => {
    copy[key] = cloneValue(value[key], seen)
  })
  return copy as T
}

/**
 * Returns a deep copy of plain data: objects, arrays, dates, regular expressions,
 * maps, and sets. Circular references are preserved. Functions and class instances
 * are returned as-is.
 *
 * @example deepClone({ user: { name: 'Ada' } })
 */
export const deepClone = <T>(value: T): T => cloneValue(value, new WeakMap())
