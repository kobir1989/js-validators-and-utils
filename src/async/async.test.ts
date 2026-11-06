import { mapLimit } from './mapLimit'
import { retry } from './retry'
import { sleep } from './sleep'
import { withTimeout } from './withTimeout'

describe('retry', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('returns the value after earlier attempts fail', async () => {
    const operation = jest.fn(async () => {
      if (operation.mock.calls.length < 3) throw new Error('Operation failed')
      return 'Operation succeeded'
    })
    const pending = retry(operation, 3, 1000, { onError: () => undefined })
    await jest.runAllTimersAsync()
    await expect(pending).resolves.toBe('Operation succeeded')
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it('throws the historical message and logs each failed attempt', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const operation = jest.fn(async () => {
      throw new Error('Operation failed')
    })
    const pending = retry(operation, 2, 1000)
    const assertion = expect(pending).rejects.toThrow(
      'Operation failed after 2 retries'
    )
    await jest.runAllTimersAsync()
    await assertion
    expect(operation).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })

  it('rejects invalid arguments before the first attempt', async () => {
    await expect(
      retry('nope' as unknown as () => Promise<void>, 1, 0)
    ).rejects.toThrow('Operation must be a function.')
    await expect(retry(async () => 'ok', 0, 0)).rejects.toThrow(
      'positive integer'
    )
    await expect(retry(async () => 'ok', 1, -1)).rejects.toThrow('non-negative')
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    await expect(
      retry(
        async () => {
          throw 'offline'
        },
        1,
        0
      )
    ).rejects.toThrow('after 1 retries')
    expect(spy).toHaveBeenCalledWith('Attempt 1 failed: offline')
    spy.mockRestore()
  })
})

describe('sleep, timeout, and concurrency', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('resolves sleep and rejects a slow promise', async () => {
    const pending = sleep(250)
    await jest.advanceTimersByTimeAsync(250)
    await expect(pending).resolves.toBeUndefined()

    let resolveLate: (value: string) => void = () => undefined
    const late = new Promise<string>(resolve => {
      resolveLate = resolve
    })
    const timed = withTimeout(late, 100, 'The request took too long')
    const assertion = expect(timed).rejects.toThrow('The request took too long')
    await jest.advanceTimersByTimeAsync(100)
    await assertion
    resolveLate('done')

    await expect(
      withTimeout(Promise.reject(new Error('boom')), 100)
    ).rejects.toThrow('boom')
    expect(() => sleep(-1)).toThrow('non-negative')
    expect(() => withTimeout(Promise.resolve(1), -1)).toThrow('non-negative')
  })

  it('keeps at most the requested number of operations running', async () => {
    jest.useRealTimers()
    let active = 0
    let maxActive = 0
    let release: () => void = () => undefined
    const gate = new Promise<void>(resolve => {
      release = resolve
    })

    const pending = mapLimit([1, 2, 3], 2, async value => {
      active += 1
      maxActive = Math.max(maxActive, active)
      await gate
      active -= 1
      return value * 2
    })

    await Promise.resolve()
    expect(maxActive).toBe(2)
    release()
    await expect(pending).resolves.toEqual([2, 4, 6])
    expect(maxActive).toBe(2)
    await expect(mapLimit([], 2, async value => value)).resolves.toEqual([])
    await expect(mapLimit([1], 0, async value => value)).rejects.toThrow(
      'positive integer'
    )
    await expect(
      mapLimit('nope' as unknown as number[], 1, async value => value)
    ).rejects.toThrow('array')
  })
})
