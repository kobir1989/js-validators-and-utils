import { isBrowser } from './isBrowser'

/**
 * Copies text to the clipboard. Returns false in non-browser environments and when
 * the Clipboard API and the legacy copy command both fail.
 *
 * @example await copyToClipboard('https://example.com')
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof text !== 'string') throw new Error('Text must be a string.')
  if (!isBrowser()) return false

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path.
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(area)
    return copied
  } catch {
    return false
  }
}
