import { useCallback, useEffect, useState } from 'react'
import { copyToClipboard } from '../browser/copyToClipboard'

export interface ClipboardState {
  copied: boolean
  error: Error | null
  copy: (text: string) => Promise<boolean>
}

/**
 * Copies text and reports the result. `copied` returns to false after `resetAfter` milliseconds.
 *
 * @example const { copy, copied } = useClipboard()
 */
export const useClipboard = (resetAfter = 2000): ClipboardState => {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!copied) return undefined
    const timeoutId = setTimeout(() => setCopied(false), resetAfter)
    return () => clearTimeout(timeoutId)
  }, [copied, resetAfter])

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      const didCopy = await copyToClipboard(text)
      setCopied(didCopy)
      setError(didCopy ? null : new Error('Unable to copy text.'))
      return didCopy
    } catch (cause) {
      const nextError =
        cause instanceof Error ? cause : new Error('Unable to copy text.')
      setCopied(false)
      setError(nextError)
      return false
    }
  }, [])

  return { copied, error, copy }
}
