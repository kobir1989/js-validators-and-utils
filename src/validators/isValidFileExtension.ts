import { checkArgs, checkArgsArray } from '../internal/checkArgs'

/**
 * Returns true when the file name ends with one of the allowed extensions.
 * Comparison is case-insensitive. A leading dot on an allowed extension is optional.
 * Only the final extension is checked, so `archive.tar.gz` matches `gz`.
 *
 * @example isValidFileExtension(['jpg', 'png'], 'photo.PNG') // true
 */
export const isValidFileExtension = (
  allowedExtensions: readonly string[],
  fileName: string
): boolean => {
  checkArgs(fileName, 'string', 'The fileName parameter must be a string.')
  checkArgsArray(
    allowedExtensions,
    'The allowedExtensions parameter must be an array.'
  )

  if (!allowedExtensions.length) {
    throw new Error(
      'The allowedExtensions array must contain at least one allowed extension.'
    )
  }

  const fileExtension = fileName.split('.').pop()?.toLowerCase()
  if (!fileExtension) {
    throw new Error(
      `The fileName "${fileName}" does not have a valid file extension.`
    )
  }

  const normalized = allowedExtensions.map(extension =>
    extension.trim().toLowerCase().replace(/^\./, '')
  )
  return normalized.includes(fileExtension)
}
