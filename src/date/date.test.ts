import { addDays } from './addDays'
import { addMonths } from './addMonths'
import { diffInDays, isAfter, isBefore, isSameDay } from './compare'
import { dateFormatter } from './dateFormatter'
import { endOfDay, startOfDay } from './dayBounds'
import { formatRelative } from './formatRelative'

describe('dateFormatter', () => {
  it('formats valid dates and preserves the historical invalid results', () => {
    expect(dateFormatter('2023-09-06T14:30:00')).toBe('September 6, 2023')
    expect(
      dateFormatter(
        '2023-09-06T14:30:00',
        { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
        'bn-BD'
      )
    ).toBe('বুধবার, ৬ সেপ্টেম্বর, ২০২৩')
    expect(dateFormatter('invalid-date')).toBe('Invalid Date')
    expect(dateFormatter('')).toBe('')
  })

  it('returns the historical message when Intl rejects the locale', () => {
    expect(dateFormatter('2023-09-06', {}, 'not-a-locale-@@@')).toBe(
      'Invalid Date format'
    )
  })
})

describe('calendar math', () => {
  it('adds days and months without mutating the input', () => {
    const input = new Date(2024, 0, 31, 12, 30)
    expect(addDays(input, 1).getDate()).toBe(1)
    expect(input.getDate()).toBe(31)
    expect(addMonths('2024-01-31T12:00:00', 1).getDate()).toBe(29)
    expect(addMonths('2023-01-31T12:00:00', 1).getDate()).toBe(28)
    expect(() => addDays('nope', 1)).toThrow('Invalid date')
    expect(() => addDays('2024-01-01', Number.NaN)).toThrow('finite number')
    expect(() => addMonths('2024-01-01', Number.NaN)).toThrow('finite number')
    expect(() => startOfDay('nope')).toThrow('Invalid date')
    expect(() => endOfDay('nope')).toThrow('Invalid date')
  })

  it('compares local days, including a daylight-saving boundary', () => {
    const morning = new Date(2024, 4, 6, 1)
    const evening = new Date(2024, 4, 6, 23)
    expect(startOfDay(morning).getHours()).toBe(0)
    expect(endOfDay(morning).getMilliseconds()).toBe(999)
    expect(morning.getHours()).toBe(1)
    expect(isSameDay(morning, evening)).toBe(true)
    expect(isSameDay(morning, addDays(morning, 1))).toBe(false)
    expect(isBefore('2024-01-01', '2024-01-02')).toBe(true)
    expect(isAfter('2024-01-02', '2024-01-01')).toBe(true)
    expect(isBefore('nope', '2024-01-01')).toBe(false)
    expect(isSameDay('nope', 'also-nope')).toBe(false)
    expect(diffInDays('2024-03-09', '2024-03-11')).toBe(2)
    expect(diffInDays('2024-03-11', '2024-03-09')).toBe(-2)
    expect(() => diffInDays('nope', '2024-01-01')).toThrow('Invalid date')
  })

  it('formats relative time from a fixed clock', () => {
    const base = new Date('2024-01-01T00:00:00Z')
    expect(formatRelative(new Date('2024-01-01T00:05:00Z'), base)).toBe(
      'in 5 minutes'
    )
    expect(formatRelative(new Date('2023-12-31T00:00:00Z'), base)).toBe(
      'yesterday'
    )
    expect(formatRelative('nope', base)).toBe('Invalid Date')
    expect(formatRelative(base, 'nope')).toBe('Invalid Date')
  })
})
