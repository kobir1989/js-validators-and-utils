/**
 * Returns true when `window` and `document` are available.
 *
 * @example if (isBrowser()) document.title = 'Ready'
 */
export const isBrowser = (): boolean => {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { window?: unknown }).window !== 'undefined' &&
    typeof (globalThis as { document?: unknown }).document !== 'undefined'
  )
}
