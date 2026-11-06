import { formatBytes } from './formatBytes'
import { formatCurrency, formatNumber } from './formatNumber'
import { pluralize } from './pluralize'

describe('formatting', () => {
  it('formats numbers, currency, and byte sizes', () => {
    expect(formatNumber(1234.5, 'en-US')).toBe('1,234.5')
    expect(formatCurrency(12.5, 'USD', 'en-US')).toBe('$12.50')
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(1024, 0)).toBe('1 KB')
    expect(formatBytes(500)).toBe('500 B')
    expect(() => formatBytes(-1)).toThrow('negative')
    expect(() => formatBytes(Number.NaN)).toThrow('finite')
    expect(() => formatBytes(10, -1)).toThrow('non-negative integer')
    expect(() => formatNumber(Number.POSITIVE_INFINITY)).toThrow('finite')
    expect(() => formatCurrency(Number.NaN)).toThrow('finite')
  })

  it('pluralizes regular and irregular words', () => {
    expect(pluralize(1, 'file')).toBe('1 file')
    expect(pluralize(2, 'file')).toBe('2 files')
    expect(pluralize(2, 'box')).toBe('2 boxes')
    expect(pluralize(2, 'city')).toBe('2 cities')
    expect(pluralize(2, 'person', 'people')).toBe('2 people')
    expect(() => pluralize(1, ' ')).toThrow('non-empty')
    expect(() => pluralize(Number.NaN, 'file')).toThrow('finite')
    expect(pluralize(2, 'day')).toBe('2 days')
  })
})
