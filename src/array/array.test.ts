import { chunkArray } from './chunkArray'
import { compact } from './compact'
import { difference } from './difference'
import { flattenArray } from './flattenArray'
import { groupBy } from './groupBy'
import { intersection } from './intersection'
import { partition } from './partition'
import { shuffleArray } from './shuffleArray'
import { sortBy } from './sortBy'
import { unique } from './unique'

describe('chunkArray', () => {
  const input = [1, 2, 3, 4, 5, 6, 7]

  it('splits an array without mutating it', () => {
    expect(chunkArray(input, 2)).toEqual([[1, 2], [3, 4], [5, 6], [7]])
    expect(chunkArray(input, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]])
    expect(chunkArray(input)).toEqual([[1], [2], [3], [4], [5], [6], [7]])
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('returns one group when the size covers the whole array', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 5)).toEqual([[1, 2, 3, 4, 5]])
    expect(chunkArray([1, 2, 3, 4, 5], 10)).toEqual([[1, 2, 3, 4, 5]])
  })

  it('rejects a size that would not make progress', () => {
    expect(() => chunkArray([1], 0)).toThrow('positive integer')
    expect(() => chunkArray([1], 1.5)).toThrow('positive integer')
    expect(() => chunkArray('nope' as unknown as number[], 1)).toThrow(
      'First Argument Should be an Array!'
    )
  })
})

describe('flattenArray', () => {
  it('flattens to the requested depth and preserves the historical edge cases', () => {
    expect(flattenArray([1, 2, 3, [4, 5, 6]], 1)).toEqual([1, 2, 3, 4, 5, 6])
    expect(flattenArray([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]])
    expect(flattenArray([1, [2, [3, [4]]]], 0)).toEqual([1, [2, [3, [4]]]])
    expect(flattenArray([1, [2, [3, [4]]]], -1)).toEqual([1, [2, [3, [4]]]])
    expect(flattenArray([], 2)).toEqual([])
    expect(flattenArray([1, 2, 3], 2)).toEqual([1, 2, 3])
    expect(flattenArray([1, 'two', [3, 'four', [5]]], 2)).toEqual([
      1,
      'two',
      3,
      'four',
      5
    ])
    expect(flattenArray([1, 'two', { key: 'value' }, [4, 5]], 2)).toEqual([
      1,
      'two',
      { key: 'value' },
      4,
      5
    ])
  })

  it('flattens nested arrays that are longer than their parent', () => {
    expect(
      flattenArray(
        [
          [1, 2, 3],
          [4, [5, 6, 7]]
        ],
        2
      )
    ).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('returns the same reference when there is nothing to flatten', () => {
    const nested = [1, [2]]
    expect(flattenArray(nested, 0)).toBe(nested)
    expect(flattenArray([], 3)).toEqual([])
  })
})

describe('shuffleArray', () => {
  it('returns a permutation and leaves the input untouched', () => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(original)
    expect(shuffled).toHaveLength(original.length)
    expect([...shuffled].sort()).toEqual([...original].sort())
    expect(original).toEqual([1, 2, 3, 4, 5])
    expect(shuffleArray([])).toEqual([])
    expect(shuffleArray(['only'])).toEqual(['only'])
    expect(() => shuffleArray([1], 'nope' as unknown as () => number)).toThrow(
      'function'
    )
  })

  it('uses the supplied random source', () => {
    const sequence = [0, 0]
    let index = 0
    const shuffled = shuffleArray(['a', 'b', 'c'], () => sequence[index++] ?? 0)
    expect(shuffled).toEqual(['b', 'c', 'a'])
  })
})

describe('collection helpers', () => {
  it('removes duplicates, groups, sorts, and partitions', () => {
    expect(unique([1, 1, 2, 2, 3])).toEqual([1, 2, 3])
    expect(unique([{ id: 1 }, { id: 1 }], item => item.id)).toEqual([{ id: 1 }])
    expect(
      groupBy([{ type: 'a' }, { type: 'b' }, { type: 'a' }], item => item.type)
    ).toEqual({
      a: [{ type: 'a' }, { type: 'a' }],
      b: [{ type: 'b' }]
    })
    expect(
      sortBy(
        [
          { n: 1, id: 'a' },
          { n: 1, id: 'b' },
          { n: 0, id: 'c' },
          { n: null, id: 'd' }
        ],
        item => item.n
      ).map(item => item.id)
    ).toEqual(['c', 'a', 'b', 'd'])
    expect(
      sortBy(
        [
          { on: new Date('2024-02-01'), name: 'b' },
          { on: new Date('2024-01-01'), name: 'a' }
        ],
        item => item.on
      ).map(item => item.name)
    ).toEqual(['a', 'b'])
    expect(sortBy([true, false, true], item => item)).toEqual([
      false,
      true,
      true
    ])
    expect(sortBy(['b', 'a', 'b'], item => item)).toEqual(['a', 'b', 'b'])
    expect(sortBy([Number.NaN, 1], item => item)).toEqual([1, Number.NaN])
    expect(sortBy([Number.NaN, null], item => item)).toEqual([Number.NaN, null])
    expect(partition([1, 2, 3, 4], n => n % 2 === 0)).toEqual([
      [2, 4],
      [1, 3]
    ])
  })

  it('compares lists and drops nullish values', () => {
    expect(difference([1, 2, 3, Number.NaN], [2], [3])).toEqual([1, Number.NaN])
    expect(difference([1, Number.NaN], [Number.NaN])).toEqual([1])
    expect(intersection([1, 2, 2], [2, 3], [2, 4])).toEqual([2])
    expect(intersection()).toEqual([])
    expect(compact([0, null, 1, undefined, false, ''])).toEqual([
      0,
      1,
      false,
      ''
    ])
  })
})
