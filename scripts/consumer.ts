import {
  chunkArray,
  clamp,
  debounce,
  getPath,
  isValidEmail,
  type PasswordStrength
} from '../dist/index.js'
import { groupBy } from '../dist/array.js'
import { useDebounce } from '../dist/react.js'

const chunks: number[][] = chunkArray([1, 2, 3, 4], 2)
const allowed: boolean = isValidEmail('user@example.com')
const nested = getPath({ user: { name: 'Ada' } }, 'user.name', 'Guest')
const limited = clamp(8, 0, 5)
const save = debounce((value: string) => value.length, 10)
save('ok')

const grouped = groupBy([{ type: 'a' }], item => item.type)
const strength: PasswordStrength = {
  hasChar: true,
  hasSymble: true,
  hasNumber: true,
  hasUppercase: true
}
const debouncedValue = useDebounce('query', 200)

export const consumerSmoke = {
  chunks,
  allowed,
  nested,
  limited,
  grouped,
  strength,
  debouncedValue
}
