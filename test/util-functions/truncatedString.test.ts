import { truncatedString } from '../../src/util-functions/string-manipulation/truncateString'

describe('truncatedString', () => {
  it('should truncate a string with default values', () => {
    const inputString = 'This is a long sentence that needs to be truncated.'
    const expectedOutput = 'This is a long sentence that n...'

    const result = truncatedString(inputString)

    expect(result).toBe(expectedOutput)
  })

  it('should truncate a string with custom start and end indices', () => {
    const inputString = 'Customizing truncation'
    const start = 0
    const end = 8
    const expectedOutput = 'Customiz...'

    const result = truncatedString(inputString, start, end)

    expect(result).toBe(expectedOutput)
  })

  it('should handle empty strings', () => {
    const inputString = ''
    const expectedOutput = ''

    const result = truncatedString(inputString)

    expect(result).toBe(expectedOutput)
  })

  it('should handle leading and trailing whitespace', () => {
    const inputString = '   Trim me   '
    const expectedOutput = 'Trim me...'

    const result = truncatedString(inputString)

    expect(result).toBe(expectedOutput)
  })
})