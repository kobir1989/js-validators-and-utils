import { checkArgs } from '../internal/checkArgs'

const splitWords = (value: string): string[] => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
}

/**
 * Converts a string to camelCase.
 *
 * @example camelCase('hello world') // 'helloWorld'
 */
export const camelCase = (value: string): string => {
  checkArgs(value, 'string', 'Argument should be a string')
  return splitWords(value)
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (index === 0) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

/**
 * Converts a string to snake_case.
 *
 * @example snakeCase('helloWorld') // 'hello_world'
 */
export const snakeCase = (value: string): string => {
  checkArgs(value, 'string', 'Argument should be a string')
  return splitWords(value)
    .map(word => word.toLowerCase())
    .join('_')
}

/**
 * Converts a string to kebab-case.
 *
 * @example kebabCase('helloWorld') // 'hello-world'
 */
export const kebabCase = (value: string): string => {
  checkArgs(value, 'string', 'Argument should be a string')
  return splitWords(value)
    .map(word => word.toLowerCase())
    .join('-')
}
