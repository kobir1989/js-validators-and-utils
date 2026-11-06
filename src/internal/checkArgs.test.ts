import { checkArgs, checkArgsArray } from './checkArgs'

describe('checkArgs', () => {
  it('throws when the runtime type does not match', () => {
    expect(() =>
      checkArgs('test string', 'number', 'Type should be String!')
    ).toThrow('Type should be String!')
  })

  it('accepts a matching number or string', () => {
    expect(() =>
      checkArgs(1234, 'number', 'Type should be number')
    ).not.toThrow()
    expect(() =>
      checkArgs('test String', 'string', 'Type should be string')
    ).not.toThrow()
  })
})

describe('checkArgsArray', () => {
  it('throws for a non-array', () => {
    expect(() =>
      checkArgsArray({ a: 'test1' }, 'Expecting Array of String')
    ).toThrow('Expecting Array of String')
  })

  it('accepts an array', () => {
    expect(() => checkArgsArray(['test1', 'test2'], '')).not.toThrow()
  })
})
