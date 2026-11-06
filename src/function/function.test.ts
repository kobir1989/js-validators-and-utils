import { compose, pipe } from './compose'
import { debounce } from './debounce'
import { memoize } from './memoize'
import { once } from './once'
import { throttle } from './throttle'

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('invokes the latest call once the delay has passed', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 300)
    debounced('a')
    debounced('b')
    debounced('c')
    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('preserves this, cancels a pending call, and can flush it', () => {
    const context = { key: 'value' }
    const fn = jest.fn(function (this: typeof context) {
      expect(this).toBe(context)
    })
    const debounced = debounce(fn, 300)
    debounced.call(context)
    debounced.flush()
    expect(fn).toHaveBeenCalledTimes(1)

    debounced.call(context)
    debounced.cancel()
    jest.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
    debounced.flush()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(() => debounce('nope' as unknown as () => void, 10)).toThrow(
      'function'
    )
    expect(() => debounce(() => undefined, -1)).toThrow('non-negative')
  })
})

describe('throttle', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('invokes immediately and once more at the end of the window', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100)
    throttled('a')
    throttled('b')
    throttled('c')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('a')
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('c')
  })

  it('can cancel a trailing call', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 100, { leading: false })
    throttled()
    throttled.cancel()
    jest.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
    const leadingOnly = throttle(fn, 100, { trailing: false })
    leadingOnly('once')
    leadingOnly('ignored')
    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(() => throttle('nope' as unknown as () => void, 10)).toThrow(
      'function'
    )
    expect(() => throttle(() => undefined, -1)).toThrow('non-negative')
  })
})

describe('memoize, once, compose, and pipe', () => {
  it('caches results until the cache is cleared', () => {
    const fn = jest.fn((value: number) => value * 2)
    const memoized = memoize(fn)
    expect(memoized(2)).toBe(4)
    expect(memoized(2)).toBe(4)
    expect(fn).toHaveBeenCalledTimes(1)
    memoized.cache.clear()
    expect(memoized(2)).toBe(4)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('uses a resolver for object arguments', () => {
    const fn = jest.fn((user: { id: number }) => user.id)
    const memoized = memoize(fn, user => String(user.id))
    expect(memoized({ id: 1 })).toBe(1)
    expect(memoized({ id: 1 })).toBe(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('calls once and composes in both directions', () => {
    const fn = jest.fn((value: number) => value + 1)
    const wrapped = once(fn)
    expect(wrapped(1)).toBe(2)
    expect(wrapped(5)).toBe(2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(
      pipe(
        (n: number) => n * 2,
        (n: number) => n + 1
      )(3)
    ).toBe(7)
    expect(
      compose(
        (n: number) => n + 1,
        (n: number) => n * 2
      )(3)
    ).toBe(7)
    expect(() => memoize('nope' as unknown as () => void)).toThrow('function')
    expect(() => once('nope' as unknown as () => void)).toThrow('function')
    const byObject = memoize((value: { id: number }) => value.id)
    expect(byObject({ id: 4 })).toBe(4)
    expect(byObject({ id: 4 })).toBe(4)
  })
})
