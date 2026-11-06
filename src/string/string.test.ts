import { camelCase, kebabCase, snakeCase } from './changeCase'
import { capitalize, capitalizeString } from './capitalizeString'
import { escapeHtml } from './escapeHtml'
import { sluggifiedString } from './sluggifiedString'
import { truncatedString } from './truncateString'
import { wordCount } from './wordCount'

describe('capitalizeString', () => {
  it('capitalizes each word and keeps the historical whitespace behavior', () => {
    expect(capitalizeString('test this string')).toBe('Test This String')
    expect(capitalizeString('hello world')).toBe('Hello World')
    expect(capitalizeString('')).toBe('')
    expect(capitalizeString('word')).toBe('Word')
    expect(capitalizeString('   example  ')).toBe('Example')
    expect(capitalizeString('my name is john!')).toBe('My Name Is John!')
    expect(capitalizeString('This Is Capitalized')).toBe('This Is Capitalized')
    expect(capitalizeString('hello  world')).toBe('Hello  World')
  })

  it('capitalizes only the first character', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('hELLO')).toBe('HELLO')
    expect(capitalize('')).toBe('')
  })
})

describe('truncatedString', () => {
  it('truncates with the historical defaults and indexes', () => {
    expect(
      truncatedString('This is a long sentence that needs to be truncated.')
    ).toBe('This is a long sentence that n...')
    expect(truncatedString('Customizing truncation', 0, 8)).toBe('Customiz...')
    expect(truncatedString('')).toBe('')
    expect(truncatedString('   Trim me   ')).toBe('Trim me')
    expect(
      truncatedString(
        'This String Should not truncated and should not add...',
        54,
        70
      )
    ).toBe('This String Should not truncated and should not add...')
  })

  it('rejects a non-finite bound', () => {
    expect(() => truncatedString('hello', Number.NaN, 2)).toThrow(
      'finite numbers'
    )
  })
})

describe('sluggifiedString', () => {
  it('builds the historical slugs for plain words', () => {
    expect(sluggifiedString('This is a test string')).toBe(
      'this-is-a-test-string'
    )
    expect(
      sluggifiedString('Custom separator example', { separator: '_' })
    ).toBe('custom_separator_example')
    expect(sluggifiedString('Test Case Example', { case: 'lower' })).toBe(
      'test-case-example'
    )
    expect(sluggifiedString('Test Case Example', { case: 'upper' })).toBe(
      'TEST-CASE-EXAMPLE'
    )
    expect(sluggifiedString('Test Case Example', { case: 'title' })).toBe(
      'Test-Case-Example'
    )
    expect(
      sluggifiedString('This is a sample title', {
        removeStopWords: true,
        stopWords: ['this', 'is', 'a']
      })
    ).toBe('sample-title')
    expect(
      sluggifiedString('This is a sample title', { removeStopWords: false })
    ).toBe('this-is-a-sample-title')
    expect(
      sluggifiedString('This is a very long title that needs to be shortened', {
        maxLength: 30
      })
    ).toBe('this-is-a-very-long-title-that')
  })

  it('removes punctuation and accents, and rejects an empty string', () => {
    expect(sluggifiedString('Hello, World!')).toBe('hello-world')
    expect(sluggifiedString('Café Menu')).toBe('cafe-menu')
    expect(() => sluggifiedString('   ')).toThrow(
      'Input string cannot be empty'
    )
    expect(() => sluggifiedString('Hello', null as unknown as object)).toThrow(
      'Argument should be Object'
    )
  })
})

describe('case, words, and HTML', () => {
  it('converts identifiers and counts words', () => {
    expect(camelCase('hello world')).toBe('helloWorld')
    expect(camelCase('XMLHttpRequest')).toBe('xmlHttpRequest')
    expect(snakeCase('helloWorld')).toBe('hello_world')
    expect(kebabCase('helloWorld')).toBe('hello-world')
    expect(wordCount('one two  three')).toBe(3)
    expect(wordCount('   ')).toBe(0)
  })

  it('escapes HTML characters', () => {
    expect(escapeHtml(`<b class="a">Ada & Grace</b>`)).toBe(
      '&lt;b class=&quot;a&quot;&gt;Ada &amp; Grace&lt;/b&gt;'
    )
  })
})
