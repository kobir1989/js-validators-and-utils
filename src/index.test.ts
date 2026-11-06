import * as api from './index'

describe('public entry', () => {
  it('keeps the original utilities on the core entry and leaves hooks out of it', () => {
    expect(Object.keys(api)).toEqual(
      expect.arrayContaining([
        'isValidEmail',
        'isPasswordMatched',
        'isValidURL',
        'isValidPhoneNumber',
        'isValidDate',
        'isStrongPassword',
        'isValidUserName',
        'isValidFileExtension',
        'capitalizeString',
        'truncatedString',
        'sluggifiedString',
        'dateFormatter',
        'shuffleArray',
        'chunkArray',
        'flattenArray',
        'fetchWrapper',
        'retry',
        'debounce'
      ])
    )
    expect(Object.keys(api)).not.toContain('useDebounce')
    expect(api.chunkArray([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4]
    ])
  })
})
