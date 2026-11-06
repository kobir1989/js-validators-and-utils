import { checkArgs } from '../internal/checkArgs'

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

/**
 * Escapes `&`, `<`, `>`, `"`, and `'` for insertion into HTML text or attributes.
 *
 * @example escapeHtml('<b>Ada & Grace</b>')
 */
export const escapeHtml = (value: string): string => {
  checkArgs(value, 'string', 'Argument should be a string')
  return value.replace(/[&<>"']/g, character => ESCAPES[character] ?? character)
}
