import { clamp } from './clamp'
import { inRange } from './inRange'
import { randomInt } from './randomInt'
import { range } from './range'
import { roundTo } from './roundTo'
import { average, sum } from './sum'

describe('number helpers', () => {
  it('clamps, rounds, and checks ranges', () => {
    expect(clamp(12, 0, 10)).toBe(10)
    expect(clamp(-2, 0, 10)).toBe(0)
    expect(clamp(4, 0, 10)).toBe(4)
    expect(() => clamp(1, 5, 1)).toThrow('min cannot be greater than max')
    expect(() => clamp(Number.NaN, 0, 1)).toThrow('finite number')

    expect(roundTo(1.005, 2)).toBe(1.01)
    expect(roundTo(-1.235, 2)).toBe(-1.24)
    expect(roundTo(1.2)).toBe(1)
    expect(() => roundTo(1, 1.5)).toThrow('Decimals')

    expect(inRange(5, 1, 5)).toBe(true)
    expect(inRange(0, 1, 5)).toBe(false)
    expect(() => inRange(1, 2, 1)).toThrow('min cannot be greater than max')
    expect(() => inRange(Number.NaN, 0, 1)).toThrow('finite numbers')
    expect(() => roundTo(Number.POSITIVE_INFINITY, 2)).toThrow('finite number')
  })

  it('builds ranges and summarizes numbers', () => {
    const sequence = [0.1, 0.9]
    let index = 0
    expect(randomInt(1, 3, () => sequence[index++] ?? 0)).toBe(1)
    expect(randomInt(1, 1)).toBe(1)
    expect(() => randomInt(2, 1)).toThrow('max must be greater')
    expect(() => randomInt(1.5, 2)).toThrow('integers')
    expect(() => randomInt(1, 2, 'nope' as unknown as () => number)).toThrow(
      'function'
    )

    expect(range(4)).toEqual([0, 1, 2, 3])
    expect(range(1, 4)).toEqual([1, 2, 3])
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
    expect(range(4, 1, -1)).toEqual([4, 3, 2])
    expect(() => range(0, 2, 0)).toThrow('Step cannot be zero')
    expect(() => range(Number.NaN, 2)).toThrow('finite numbers')

    expect(sum([1, 2, 3])).toBe(6)
    expect(sum([])).toBe(0)
    expect(average([2, 4])).toBe(3)
    expect(() => average([])).toThrow('empty list')
    expect(() => sum([1, Number.NaN])).toThrow('finite numbers')
  })
})
