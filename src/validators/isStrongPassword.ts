import { checkArgs } from '../internal/checkArgs'

/**
 * Character-class report for a password.
 * `hasSymble` keeps its original spelling so existing callers continue to work.
 */
export interface PasswordStrength {
  /** True when the password contains at least `minChars` letters. */
  hasChar: boolean
  /** True when the password contains at least `minSymbols` symbols. */
  hasSymble: boolean
  /** True when the password contains at least `minNumbers` digits. */
  hasNumber: boolean
  /** True when the password contains an uppercase ASCII letter. */
  hasUppercase: boolean
}

const SYMBOLS = /[$&+,:;=?@#|'<>.^*()%!-]/g

/**
 * Reports which password rules passed. It does not throw for a weak password.
 * Symbols counted by the original rule set are `$&+,:;=?@#|'<>.^*()%!-`.
 *
 * @example isStrongPassword('Abc$d@123')
 */
export const isStrongPassword = (
  password: string,
  minChars = 2,
  minSymbols = 2,
  minNumbers = 2
): PasswordStrength => {
  checkArgs(password, 'string', 'Password Must be string!')

  return {
    hasChar: (password.match(/[A-Za-z]/g) || []).length >= minChars,
    hasSymble: (password.match(SYMBOLS) || []).length >= minSymbols,
    hasNumber: (password.match(/[0-9]/g) || []).length >= minNumbers,
    hasUppercase: /[A-Z]/.test(password)
  }
}
