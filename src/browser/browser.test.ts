import { isBrowser } from './isBrowser'
import { parseQuery, stringifyQuery } from './queryString'
import { readStorage, removeStorage, writeStorage } from './storage'
import type { KeyValueStorage } from './storage'

class MemoryStorage implements KeyValueStorage {
  readonly values = new Map<string, string>()
  failOnWrite = false

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    if (this.failOnWrite) throw new Error('full')
    this.values.set(key, value)
  }

  removeItem(key: string): void {
    if (this.failOnWrite) throw new Error('blocked')
    this.values.delete(key)
  }
}

describe('browser helpers outside a document', () => {
  it('reports that there is no document and ignores missing storage', () => {
    expect(isBrowser()).toBe(false)
    expect(readStorage('theme', 'light')).toBe('light')
    expect(writeStorage('theme', 'dark')).toBe(false)
    expect(() => removeStorage('theme')).not.toThrow()
  })

  it('reads and writes JSON through an injected store', () => {
    const store = new MemoryStorage()
    expect(writeStorage('theme', { mode: 'dark' }, store)).toBe(true)
    expect(readStorage('theme', { mode: 'light' }, store)).toEqual({
      mode: 'dark'
    })
    expect(readStorage('missing', 1, store)).toBe(1)
    store.values.set('broken', '{')
    expect(readStorage('broken', 'fallback', store)).toBe('fallback')
    removeStorage('theme', store)
    expect(store.getItem('theme')).toBeNull()

    store.failOnWrite = true
    expect(writeStorage('theme', 'dark', store)).toBe(false)
    expect(() => removeStorage('theme', store)).not.toThrow()
  })

  it('parses and builds query strings', () => {
    expect(
      parseQuery('https://example.com/search?page=2&tag=js&tag=ts#top')
    ).toEqual({
      page: '2',
      tag: ['js', 'ts']
    })
    expect(parseQuery('page=1')).toEqual({ page: '1' })
    expect(parseQuery('?page=1#results')).toEqual({ page: '1' })
    expect(
      stringifyQuery({ page: 2, tag: ['js', 'ts'], empty: null, ok: true })
    ).toBe('page=2&tag=js&tag=ts&ok=true')
    expect(() => parseQuery(1 as unknown as string)).toThrow('string')
  })
})
