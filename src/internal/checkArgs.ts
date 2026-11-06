/**
 * Throws when `input` is not of the requested runtime type.
 * `typeof null === 'object'`, matching the historical behavior.
 */
export const checkArgs = (
  input: unknown,
  type: string,
  message: string
): void => {
  if (typeof input !== type) {
    throw new Error(message)
  }
}

/** Throws when `value` is not an array. */
export const checkArgsArray = (value: unknown, message: string): void => {
  if (!Array.isArray(value)) {
    throw new Error(message)
  }
}
