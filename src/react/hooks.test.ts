/**
 * @jest-environment jsdom
 */
import { createElement, useRef } from 'react'
import { act, fireEvent, render, renderHook } from '@testing-library/react'
import { useClickOutside } from './useClickOutside'
import { useClipboard } from './useClipboard'
import { useDebounce } from './useDebounce'
import { useEventListener } from './useEventListener'
import { useIsMounted } from './useIsMounted'
import { useLocalStorage } from './useLocalStorage'
import { useMediaQuery } from './useMediaQuery'
import { usePrevious } from './usePrevious'
import { useToggle } from './useToggle'

describe('React hooks', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    window.localStorage.clear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('debounces a value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: 'a' } }
    )
    expect(result.current).toBe('a')
    rerender({ value: 'b' })
    expect(result.current).toBe('a')
    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe('b')
  })

  it('toggles boolean state and remembers the previous value', () => {
    const toggle = renderHook(() => useToggle(false))
    act(() => toggle.result.current[1]())
    expect(toggle.result.current[0]).toBe(true)
    act(() => toggle.result.current[2](false))
    expect(toggle.result.current[0]).toBe(false)

    const previous = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 }
    })
    expect(previous.result.current).toBeUndefined()
    previous.rerender({ value: 2 })
    expect(previous.result.current).toBe(1)
  })

  it('tracks mount state and stored JSON', async () => {
    window.localStorage.setItem('theme', JSON.stringify('dark'))
    const stored = renderHook(() => useLocalStorage('theme', 'light'))
    expect(stored.result.current[0]).toBe('dark')
    act(() => stored.result.current[1]('light'))
    expect(window.localStorage.getItem('theme')).toBe(JSON.stringify('light'))
    act(() => stored.result.current[1](current => `${current}er`))
    expect(stored.result.current[0]).toBe('lighter')
    act(() => stored.result.current[2]())
    expect(window.localStorage.getItem('theme')).toBeNull()
    expect(stored.result.current[0]).toBe('light')

    const mounted = renderHook(() => useIsMounted())
    const isMounted = mounted.result.current
    expect(isMounted()).toBe(true)
    mounted.unmount()
    expect(isMounted()).toBe(false)
  })

  it('listens for media queries, outside clicks, window events, and clipboard writes', async () => {
    const listeners = new Set<(event: Event) => void>()
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes('800'),
      addEventListener: (_event: string, listener: (event: Event) => void) => {
        listeners.add(listener)
      },
      removeEventListener: (
        _event: string,
        listener: (event: Event) => void
      ) => {
        listeners.delete(listener)
      }
    }))
    const media = renderHook(() => useMediaQuery('(min-width: 800px)'))
    expect(media.result.current).toBe(true)
    const narrow = renderHook(() => useMediaQuery('(max-width: 100px)'))
    expect(narrow.result.current).toBe(false)

    const handler = jest.fn()
    renderHook(() => useEventListener('resize', handler))
    const skipped = jest.fn()
    renderHook(() => useEventListener('resize', skipped, null))
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(handler).toHaveBeenCalledTimes(1)
    expect(skipped).not.toHaveBeenCalled()

    const onOutside = jest.fn()
    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null)
      useClickOutside(ref, onOutside)
      return createElement(
        'div',
        null,
        createElement('button', { ref, type: 'button' }, 'inside')
      )
    }
    const view = render(createElement(Probe))
    fireEvent.mouseDown(view.getByRole('button'))
    expect(onOutside).not.toHaveBeenCalled()
    fireEvent.mouseDown(document.body)
    expect(onOutside).toHaveBeenCalledTimes(1)

    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })
    const clipboard = renderHook(() => useClipboard(500))
    await act(async () => {
      await clipboard.result.current.copy('copied text')
    })
    expect(clipboard.result.current.copied).toBe(true)
    expect(clipboard.result.current.error).toBeNull()
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(clipboard.result.current.copied).toBe(false)

    writeText.mockRejectedValueOnce(new Error('denied'))
    document.execCommand = jest.fn(() => {
      throw new Error('unavailable')
    })
    await act(async () => {
      await expect(clipboard.result.current.copy('again')).resolves.toBe(false)
    })
    expect(clipboard.result.current.error).toBeInstanceOf(Error)

    await act(async () => {
      await expect(
        clipboard.result.current.copy(1 as unknown as string)
      ).resolves.toBe(false)
    })
    expect(clipboard.result.current.error?.message).toBe(
      'Text must be a string.'
    )
  })
})
