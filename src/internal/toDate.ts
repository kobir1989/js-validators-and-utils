/** Copies a date input. Returns an Invalid Date when the input cannot be parsed. */
export const toDate = (input: Date | string | number): Date => {
  return input instanceof Date ? new Date(input.getTime()) : new Date(input)
}

export const isValidDateInput = (input: Date | string | number): boolean => {
  return !Number.isNaN(toDate(input).getTime())
}
