import { useCallback, useState } from 'react'

/**
 * Holds a boolean and returns a toggle function plus a direct setter.
 *
 * @example const [open, toggle, setOpen] = useToggle(false)
 */
export const useToggle = (
  initial = false
): [boolean, () => void, (value: boolean) => void] => {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => {
    setValue(current => !current)
  }, [])
  return [value, toggle, setValue]
}
