import { checkArgs } from '../internal/checkArgs'

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'ftp:'])

/**
 * Checks whether a string is an absolute http, https, or ftp URL.
 * This validates syntax, not whether the host is reachable or safe to request.
 *
 * @example isValidURL('https://example.com/docs?q=1') // true
 */
export const isValidURL = (url: string): boolean => {
  checkArgs(url, 'string', 'URL must be string!')
  if (url === '' || /\s/.test(url)) return false

  try {
    const parsed = new URL(url)
    return ALLOWED_PROTOCOLS.has(parsed.protocol) && parsed.hostname !== ''
  } catch {
    return false
  }
}
