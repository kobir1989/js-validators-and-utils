import { isValidURL } from '../../src/validartors/isValidURL'

describe('isValidURL validator function', () => {
  it('Should return true for valid http URL', () => {
    expect(isValidURL('http://www.example.com')).toBe(true)
  })

  it('Should return true for valid https URL', () => {
    expect(isValidURL('https://www.example.com')).toBe(true)
  })

  it('Should return true for valid URL with subdomain', () => {
    expect(isValidURL('https://sub.example.com')).toBe(true)
  })

  it('Should return true for valid URL with query parameters', () => {
    expect(isValidURL('https://www.example.com/page?param=value')).toBe(true)
  })

  it('Should return true for valid URL with fragments', () => {
    expect(isValidURL('https://www.example.com/page#section')).toBe(true)
  })

  it('Should return false for URL with missing protocol', () => {
    expect(isValidURL('www.example.com')).toBe(false)
  })

  it('Should return false for URL with missing domain', () => {
    expect(isValidURL('https://')).toBe(false)
  })

  it('Should return true for URL with special characters', () => {
    expect(isValidURL('https://www.example.com/@user/page#section')).toBe(true)
  })

  it('Should return false for URL with spaces', () => {
    expect(isValidURL('https://www.example.com/ space ')).toBe(false)
  })

  it('Should return false for URL with newlines', () => {
    expect(isValidURL('https://www.example.com/\nnewline')).toBe(false)
  })
})
