/**
 * @jest-environment jsdom
 */
import { copyToClipboard } from './copyToClipboard'
import { isBrowser } from './isBrowser'

describe('copyToClipboard', () => {
  it('uses the async clipboard when it is available', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })
    expect(isBrowser()).toBe(true)
    await expect(copyToClipboard('hello')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('falls back when the clipboard API fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: jest.fn().mockRejectedValue(new Error('denied')) }
    })
    document.execCommand = jest.fn().mockReturnValue(true)
    await expect(copyToClipboard('hello')).resolves.toBe(true)
    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })

  it('returns false when neither copy path works', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined
    })
    document.execCommand = jest.fn(() => {
      throw new Error('unavailable')
    })
    await expect(copyToClipboard('hello')).resolves.toBe(false)
    await expect(copyToClipboard(1 as unknown as string)).rejects.toThrow(
      'string'
    )
  })
})
