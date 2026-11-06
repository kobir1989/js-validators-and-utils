import { isBlank } from './isBlank'
import { isCreditCard } from './isCreditCard'
import { isEmpty } from './isEmpty'
import { isHexColor } from './isHexColor'
import { isInteger, isNumeric } from './isNumeric'
import { isPasswordMatched } from './isPasswordMatched'
import { isStrongPassword } from './isStrongPassword'
import { isValidDate } from './isValidDate'
import { isValidEmail } from './isValidEmail'
import { isValidFileExtension } from './isValidFileExtension'
import { isValidJSON } from './isValidJSON'
import { isValidPhoneNumber } from './isValidPhoneNumber'
import { isValidURL } from './isValidURL'
import { isValidUserName } from './isValidUserName'

describe('isValidEmail', () => {
  it('accepts common valid addresses', () => {
    expect(isValidEmail('it@sub.example.com')).toBe(true)
    expect(isValidEmail('it.User@example.com')).toBe(true)
    expect(isValidEmail('user123@example.com')).toBe(true)
    expect(isValidEmail('a@b.co')).toBe(true)
  })

  it('rejects empty, padded, incomplete, and malformed addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail(' it@example.com')).toBe(false)
    expect(isValidEmail('it@example.com ')).toBe(false)
    expect(isValidEmail('itexample.com')).toBe(false)
    expect(isValidEmail('it@example')).toBe(false)
    expect(isValidEmail('it@ex@mple.com')).toBe(false)
    expect(isValidEmail('a..b@example.com')).toBe(false)
    expect(isValidEmail('.user@example.com')).toBe(false)
    expect(isValidEmail('user.@example.com')).toBe(false)
  })

  it('throws when the argument is not a string', () => {
    expect(() => isValidEmail(1 as unknown as string)).toThrow(
      'Email Must be string!'
    )
  })
})

describe('isPasswordMatched', () => {
  it('reports a match that meets the minimum length', () => {
    expect(isPasswordMatched('password123', 'password123', 8)).toEqual({
      isTooShort: false,
      isMatched: true
    })
  })

  it('reports a mismatch and a short value independently', () => {
    expect(isPasswordMatched('password123', 'password456', 8).isMatched).toBe(
      false
    )
    expect(isPasswordMatched('pass', 'pass', 8)).toEqual({
      isTooShort: true,
      isMatched: true
    })
    expect(isPasswordMatched('pass', 'passTestNow', 8)).toEqual({
      isTooShort: true,
      isMatched: false
    })
  })

  it('throws for a non-numeric minimum length', () => {
    expect(() => isPasswordMatched('password', 'password', Number.NaN)).toThrow(
      'Minimum length should be a number!'
    )
  })
})

describe('isValidURL', () => {
  it('accepts absolute http, https, and ftp URLs', () => {
    expect(isValidURL('http://www.example.com')).toBe(true)
    expect(isValidURL('https://www.example.com')).toBe(true)
    expect(isValidURL('https://sub.example.com')).toBe(true)
    expect(isValidURL('https://www.example.com/page?param=value')).toBe(true)
    expect(isValidURL('https://www.example.com/page#section')).toBe(true)
    expect(isValidURL('https://www.example.com/@user/page#section')).toBe(true)
    expect(isValidURL('https://localhost:3000/app')).toBe(true)
    expect(isValidURL('ftp://files.example.com/readme.txt')).toBe(true)
  })

  it('rejects missing protocols, empty hosts, spaces, and non-web protocols', () => {
    expect(isValidURL('www.example.com')).toBe(false)
    expect(isValidURL('https://')).toBe(false)
    expect(isValidURL('https://www.example.com/ space ')).toBe(false)
    expect(isValidURL('https://www.example.com/\nnewline')).toBe(false)
    expect(isValidURL('javascript:alert(1)')).toBe(false)
    expect(isValidURL('')).toBe(false)
  })
})

describe('isValidPhoneNumber', () => {
  it('validates the supported locale samples', () => {
    expect(isValidPhoneNumber('01746668064', 'bn-BD')).toBe(true)
    expect(isValidPhoneNumber('81746668064', 'bn-BD')).toBe(false)
    expect(isValidPhoneNumber('8174666806', 'bn-BD')).toBe(false)
    expect(isValidPhoneNumber('123-457-8900', 'us-US')).toBe(true)
    expect(isValidPhoneNumber('12345', 'us-US')).toBe(false)
    expect(isValidPhoneNumber('9876543210', 'en-IN')).toBe(true)
    expect(isValidPhoneNumber('123', 'en-IN')).toBe(false)
    expect(isValidPhoneNumber('0412345678', 'en-AU')).toBe(true)
    expect(isValidPhoneNumber('12345', 'en-AU')).toBe(false)
    expect(isValidPhoneNumber('4161234567', 'en-CA')).toBe(true)
    expect(isValidPhoneNumber('123456789', 'en-CA')).toBe(false)
    expect(isValidPhoneNumber('015123456789', 'de-DE')).toBe(true)
    expect(isValidPhoneNumber('12345', 'de-DE')).toBe(false)
    expect(isValidPhoneNumber('08012345678', 'ja-JP')).toBe(true)
    expect(isValidPhoneNumber('12345', 'ja-JP')).toBe(false)
  })

  it('trims strings, accepts finite numbers, and rejects unknown locales', () => {
    expect(isValidPhoneNumber(' 123-457-8900 ', 'us-US')).toBe(true)
    expect(isValidPhoneNumber(1234578900, 'us-US')).toBe(false)
    expect(isValidPhoneNumber(Number.POSITIVE_INFINITY, 'en-US')).toBe(false)
    expect(isValidPhoneNumber('5551234567', 'xx-XX')).toBe(false)
  })
})

describe('isValidDate', () => {
  it('accepts real calendar days and rejects impossible ones', () => {
    expect(isValidDate('2024-02-29')).toBe(true)
    expect(isValidDate('2023-02-28')).toBe(true)
    expect(isValidDate('2023-02-29')).toBe(false)
    expect(isValidDate('2023-13-05')).toBe(false)
    expect(isValidDate('2023-09-31')).toBe(false)
    expect(isValidDate('09/05/2023')).toBe(false)
    expect(isValidDate('')).toBe(false)
    expect(isValidDate('2023-09-05T00:00:00Z')).toBe(false)
  })
})

describe('isStrongPassword', () => {
  it('keeps the original result shape', () => {
    expect(isStrongPassword('Abc$d@123')).toEqual({
      hasChar: true,
      hasSymble: true,
      hasNumber: true,
      hasUppercase: true
    })
    expect(isStrongPassword('Abc@1', 3, 1, 1)).toEqual({
      hasChar: true,
      hasSymble: true,
      hasNumber: true,
      hasUppercase: true
    })
    expect(isStrongPassword('abcd@123').hasSymble).toBe(false)
    expect(isStrongPassword('abcd@123').hasUppercase).toBe(false)
    expect(isStrongPassword('A@1', 3, 1, 1).hasChar).toBe(false)
    expect(isStrongPassword('Abcd123').hasSymble).toBe(false)
    expect(isStrongPassword('')).toEqual({
      hasChar: false,
      hasSymble: false,
      hasNumber: false,
      hasUppercase: false
    })
    expect(isStrongPassword('Password@&').hasNumber).toBe(false)
  })
})

describe('isValidUserName', () => {
  it('accepts letters, numbers, and underscores within 3 to 20 characters', () => {
    ;['john_doe123', 'user_name', 'myUsername'].forEach(name => {
      expect(isValidUserName(name)).toBe(true)
    })
  })

  it('rejects spaces, symbols, and the wrong length', () => {
    ;['user name', ' user_name ', 'user@name', 'ab', ''].forEach(name => {
      expect(isValidUserName(name)).toBe(false)
    })
    expect(isValidUserName('toolongusername1234567890')).toBe(false)
  })

  it('rejects only an exact disallowed word, ignoring case', () => {
    const disallowed = ['admin', 'root', 'password']
    ;['admin123', 'myroot', 'PasswordUser', 'useradmin'].forEach(name => {
      expect(isValidUserName(name, disallowed)).toBe(true)
    })
    ;['admin', 'root', 'password', 'Admin'].forEach(name => {
      expect(isValidUserName(name, disallowed)).toBe(false)
    })
  })
})

describe('isValidFileExtension', () => {
  it('compares the final extension without caring about case or a leading dot', () => {
    expect(isValidFileExtension(['jpg', 'png', 'gif'], 'myimage.jpg')).toBe(
      true
    )
    expect(isValidFileExtension(['jpg', 'png', 'gif'], 'document.pdf')).toBe(
      false
    )
    expect(isValidFileExtension(['jpg', 'png', 'gif'], 'myimage.PNG')).toBe(
      true
    )
    expect(isValidFileExtension(['.PDF'], 'report.pdf')).toBe(true)
    expect(isValidFileExtension(['gz'], 'archive.tar.gz')).toBe(true)
  })

  it('throws when the file name or the allow-list cannot be checked', () => {
    expect(() => isValidFileExtension(['jpg'], '')).toThrow(
      'The fileName "" does not have a valid file extension.'
    )
    expect(() => isValidFileExtension([], 'a.jpg')).toThrow(
      'at least one allowed extension'
    )
  })
})

describe('presence and scalar validators', () => {
  it('treats empty collections as empty and keeps meaningful falsy values', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Set())).toBe(true)
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty('a')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isBlank('   ')).toBe(true)
    expect(isBlank('ok')).toBe(false)
    expect(isBlank(null)).toBe(true)
  })

  it('recognizes numbers, integers, JSON, colors, and card numbers', () => {
    expect(isNumeric(12)).toBe(true)
    expect(isNumeric('12.5')).toBe(true)
    expect(isNumeric('')).toBe(false)
    expect(isNumeric('nope')).toBe(false)
    expect(isNumeric(Number.NaN)).toBe(false)
    expect(isInteger(3)).toBe(true)
    expect(isInteger(3.1)).toBe(false)
    expect(isInteger('3')).toBe(false)
    expect(isValidJSON('{"a":1}')).toBe(true)
    expect(isValidJSON('null')).toBe(true)
    expect(isValidJSON('{')).toBe(false)
    expect(isHexColor('#fff')).toBe(true)
    expect(isHexColor('#1a2b3c')).toBe(true)
    expect(isHexColor('#1a2b3c4d')).toBe(true)
    expect(isHexColor('fff')).toBe(false)
    expect(isHexColor('#gg0000')).toBe(false)
    expect(isCreditCard('4242 4242 4242 4242')).toBe(true)
    expect(isCreditCard('4242424242424241')).toBe(false)
    expect(isCreditCard('1234')).toBe(false)
  })
})
