import { useEffect, type RefObject } from 'react'

/**
 * Calls `handler` when a pointer event happens outside `ref`.
 *
 * @example useClickOutside(menuRef, () => setOpen(false))
 */
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      const element = ref.current
      const target = event.target
      if (!(target instanceof Node) || !element || element.contains(target)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, ref])
}
