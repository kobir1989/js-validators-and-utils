import { roundTo } from '../number/roundTo'

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

/**
 * Formats a byte count using 1024-based units.
 *
 * @example formatBytes(1536) // '1.5 KB'
 */
export const formatBytes = (bytes: number, decimals = 1): string => {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes)) {
    throw new Error('Bytes must be a finite number.')
  }
  if (bytes < 0) throw new Error('Bytes cannot be negative.')
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error('Decimals must be a non-negative integer.')
  }
  if (bytes === 0) return '0 B'

  const power = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1
  )
  const unit = UNITS[power] ?? 'PB'
  const value = bytes / 1024 ** power
  const rounded = power === 0 ? value : roundTo(value, decimals)
  return `${rounded} ${unit}`
}
