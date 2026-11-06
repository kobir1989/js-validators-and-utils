import { checkArgs } from '../internal/checkArgs'

/**
 * Capitalizes the first character of each whitespace-separated word.
 * Leading and trailing whitespace is removed. Repeated spaces between words are kept.
 * The rest of each word is left unchanged.
 *
 * @example capitalizeString('hello world') // 'Hello World'
 */
export const capitalizeString = (value: string): string => {
  checkArgs(value, 'string', 'Argument should be a String!')
  if (value.trim() === '') return value

  return value
    .trim()
    .split(' ')
    .map(word => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')
}

/**
 * Capitalizes only the first character and leaves the rest unchanged.
 *
 * @example capitalize('hello') // 'Hello'
 */
export const capitalize = (value: string): string => {
  checkArgs(value, 'string', 'Argument should be a String!')
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}
