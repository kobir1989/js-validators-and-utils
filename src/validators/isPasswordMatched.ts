import { checkArgs } from '../internal/checkArgs'

/** Result of comparing a password with its confirmation. */
export interface PasswordMatchResult {
  /** True when either value is shorter than `minLength`. */
  isTooShort: boolean
  /** True when both values are exactly equal. */
  isMatched: boolean
}

/**
 * Compares a password with its confirmation and reports length and equality.
 * Both flags can be true or false together.
 *
 * @example isPasswordMatched('secret12', 'secret12', 8)
 */
export const isPasswordMatched = (
  password: string,
  confirmPassword: string,
  minLength: number
): PasswordMatchResult => {
  checkArgs(password, 'string', 'Password should be strings!')
  checkArgs(
    confirmPassword,
    'string',
    'Confirm Password Password should be strings!'
  )
  if (typeof minLength !== 'number' || !Number.isFinite(minLength)) {
    throw new Error('Minimum length should be a number!')
  }

  return {
    isTooShort:
      password.length < minLength || confirmPassword.length < minLength,
    isMatched: password === confirmPassword
  }
}
