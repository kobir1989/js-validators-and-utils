import { deepClone } from './deepClone'
import { deepMerge } from './deepMerge'
import { getPath } from './getPath'
import { isEqual } from './isEqual'
import { omit } from './omit'
import { pick } from './pick'
import { setPath } from './setPath'

describe('deepClone', () => {
  it('copies nested data without sharing references', () => {
    const date = new Date('2024-01-02T00:00:00Z')
    const pattern = /abc/gi
    const source = {
      date,
      pattern,
      list: [1, { ok: true }],
      map: new Map([['a', 1]]),
      set: new Set([1])
    }
    const copy = deepClone(source)
    expect(copy).toEqual(source)
    expect(copy).not.toBe(source)
    expect(copy.list).not.toBe(source.list)
    expect(copy.date).not.toBe(date)
    expect(copy.pattern).not.toBe(pattern)
    expect(copy.map).not.toBe(source.map)
    expect(copy.set).not.toBe(source.set)
    copy.list[1] = { ok: false }
    expect(source.list[1]).toEqual({ ok: true })
  })

  it('preserves cycles and returns class instances unchanged', () => {
    const cycle: Record<string, unknown> = { name: 'a' }
    cycle.self = cycle
    const copy = deepClone(cycle)
    expect(copy).not.toBe(cycle)
    expect(copy.self).toBe(copy)

    class Box {
      constructor(public value: number) {}
    }
    const box = new Box(1)
    expect(deepClone(box)).toBe(box)
    expect(deepClone(1)).toBe(1)
  })
})

describe('deepMerge', () => {
  it('merges nested objects and replaces arrays without mutating sources', () => {
    const left = { a: { b: 1 }, list: [1], keep: true }
    const right = { a: { c: 2 }, list: [2] }
    const patch: { keep?: boolean } = {}
    patch.keep = undefined
    const merged = deepMerge(left, right, patch)
    expect(merged).toEqual({ a: { b: 1, c: 2 }, list: [2], keep: true })
    expect(left.list).toEqual([1])
    merged.list.push(3)
    expect(right.list).toEqual([2])
    expect(deepMerge({ a: 1 }, null)).toEqual({ a: 1 })
  })
})

describe('isEqual', () => {
  it('compares nested values, dates, NaN, and cycles', () => {
    expect(isEqual({ a: [1] }, { a: [1] })).toBe(true)
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(isEqual(Number.NaN, Number.NaN)).toBe(true)
    expect(isEqual(0, -0)).toBe(true)
    expect(isEqual(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true)
    expect(isEqual(/a/gi, /a/gi)).toBe(true)
    expect(isEqual(/a/g, /a/i)).toBe(false)
    expect(isEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))).toBe(true)
    expect(isEqual(new Map([[{ a: 1 }, 2]]), new Map([[{ a: 1 }, 2]]))).toBe(
      true
    )
    expect(isEqual([1], { 0: 1 })).toBe(false)
    expect(isEqual(new Date('2024-01-01'), '2024-01-01')).toBe(false)
    expect(isEqual(/a/, 'a')).toBe(false)
    expect(isEqual(new Map([['a', 1]]), new Set(['a']))).toBe(false)
    expect(isEqual([1], [1, 2])).toBe(false)
    expect(isEqual({ a: 1 }, null)).toBe(false)
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false)

    const left: Record<string, unknown> = { name: 'a' }
    left.self = left
    const right: Record<string, unknown> = { name: 'a' }
    right.self = right
    expect(isEqual(left, right)).toBe(true)
  })
})

describe('pick, omit, and paths', () => {
  const user = { id: 1, name: 'Ada', password: 'secret' }

  it('copies selected keys and leaves the rest behind', () => {
    expect(pick(user, ['id', 'name'])).toEqual({ id: 1, name: 'Ada' })
    expect(omit(user, ['password'])).toEqual({ id: 1, name: 'Ada' })
    expect(user).toEqual({ id: 1, name: 'Ada', password: 'secret' })
  })

  it('reads and writes nested paths without mutating the source', () => {
    const source = { user: { name: 'Ada' }, items: [1, 2] }
    expect(getPath(source, 'user.name', 'Guest')).toBe('Ada')
    expect(getPath(source, 'user.missing', 'Guest')).toBe('Guest')
    expect(getPath(source, 'items[0]')).toBe(1)
    expect(getPath(null, 'user.name', 'Guest')).toBe('Guest')
    expect(getPath({ ok: true }, '')).toEqual({ ok: true })

    const updated = setPath(source, 'user.name', 'Grace')
    expect(updated).toEqual({ user: { name: 'Grace' }, items: [1, 2] })
    expect(source.user.name).toBe('Ada')
    expect(setPath(source, 'items[1]', 5)).toEqual({
      user: { name: 'Ada' },
      items: [1, 5]
    })
    expect(setPath({}, 'profile.city', 'Dhaka')).toEqual({
      profile: { city: 'Dhaka' }
    })
    expect(setPath({ keep: true }, '', { replaced: true })).toEqual({
      replaced: true
    })
    expect(setPath(null, '0', 'first')).toEqual(['first'])
    expect(setPath({ count: 1 }, 'count.label', 'one')).toEqual({
      count: { label: 'one' }
    })
  })
})
