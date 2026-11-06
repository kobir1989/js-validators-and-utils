import { checkArgs, checkArgsArray } from '../internal/checkArgs'

/**
 * Returns true for a 3–20 character username of letters, numbers, and underscores.
 * Disallowed words are compared to the full username, case-insensitively.
 * A name such as `admin123` is allowed when the disallowed word is `admin`.
 *
 * @example isValidUserName('myUsername', ['admin', 'root'])
 */
export const isValidUserName = (
  userName: string,
  disallowedWords: readonly string[] = ['admin', 'root', 'password']
): boolean => {
  checkArgs(userName, 'string', 'User Name must be string!')
  checkArgsArray(
    disallowedWords,
    'Disallowed Words must be an Array of String!'
  )

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(userName)) return false

  const normalized = userName.toLowerCase()
  return !disallowedWords.some(
    word => typeof word === 'string' && word.toLowerCase() === normalized
  )
}
