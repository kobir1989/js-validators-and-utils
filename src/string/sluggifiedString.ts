import { checkArgs } from '../internal/checkArgs'

/** Options for {@link sluggifiedString}. */
export interface SluggifyOptions {
  /** Character placed between words. Defaults to `-`. An empty string also uses `-`. */
  separator?: string
  /** When true, words listed in `stopWords` are removed before the slug is built. */
  removeStopWords?: boolean
  /** Words to remove, compared case-insensitively. Defaults to an empty list. */
  stopWords?: string[]
  /** Letter case of the finished slug. Defaults to `lower`. */
  case?: 'lower' | 'upper' | 'title'
  /** Maximum length of the finished slug. The result is trimmed at a separator when possible. */
  maxLength?: number
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const trimSeparator = (value: string, separator: string): string => {
  let result = value
  while (separator && result.startsWith(separator)) {
    result = result.slice(separator.length)
  }
  while (separator && result.endsWith(separator)) {
    result = result.slice(0, -separator.length)
  }
  return result
}

const collapseSeparator = (value: string, separator: string): string => {
  if (!separator) return value
  return value.replace(
    new RegExp(`(?:${escapeRegExp(separator)}){2,}`, 'g'),
    separator
  )
}

const toTitleCase = (value: string): string =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map(word => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')

/**
 * Builds a URL slug. Accent marks are removed, punctuation becomes the separator,
 * and repeated separators are collapsed.
 *
 * @example sluggifiedString('This is a Sample Title', { removeStopWords: true, stopWords: ['is', 'a'] })
 */
export const sluggifiedString = (
  value: string,
  options: SluggifyOptions = {}
): string => {
  checkArgs(value, 'string', 'Argument should be a string')
  if (typeof options !== 'object' || options === null) {
    throw new Error('Argument should be Object')
  }
  if (value.trim() === '') throw new Error('Input string cannot be empty')

  const separator = options.separator || '-'
  let text = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

  if (options.removeStopWords) {
    const stopWords = new Set(
      (options.stopWords ?? []).map(word => word.toLowerCase())
    )
    text = text
      .split(/\s+/)
      .filter(word => !stopWords.has(word.toLowerCase()))
      .join(' ')
  }

  if (options.case === 'upper') text = text.toUpperCase()
  else if (options.case === 'title') text = toTitleCase(text)
  else text = text.toLowerCase()

  let slug = trimSeparator(
    collapseSeparator(text.replace(/[^\p{L}\p{N}]+/gu, separator), separator),
    separator
  )

  if (
    typeof options.maxLength === 'number' &&
    options.maxLength > 0 &&
    slug.length > options.maxLength
  ) {
    slug = trimSeparator(slug.slice(0, options.maxLength), separator)
  }

  return slug
}
