const pluralForm = (word: string): string => {
  if (/(?:s|x|z|ch|sh)$/i.test(word)) return `${word}es`
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`
  return `${word}s`
}

/**
 * Joins a count with the singular or plural form of a word.
 * Pass `plural` when the English plural is irregular.
 *
 * @example pluralize(2, 'file') // '2 files'
 */
export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  if (!Number.isFinite(count)) throw new Error('Count must be a finite number.')
  if (typeof singular !== 'string' || singular.trim() === '') {
    throw new Error('Singular word must be a non-empty string.')
  }
  const word = count === 1 ? singular : plural ?? pluralForm(singular)
  return `${count} ${word}`
}
