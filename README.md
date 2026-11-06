# js-validators-and-utils

Lightweight, typed utilities for JavaScript and React. The main package has no runtime dependencies. React hooks live in a separate entry, so a Node or vanilla project never loads React.

## Install

```bash
npm install js-validators-and-utils
```

Node.js 18 or newer is required. React 17 or newer is an optional peer dependency used only by the React entry.

## Import

The package ships ESM and CommonJS. Bundlers can tree-shake the ESM build. `sideEffects` is `false`.

```ts
import { chunkArray, isValidEmail } from 'js-validators-and-utils'
import { groupBy } from 'js-validators-and-utils/array'
import { useDebounce } from 'js-validators-and-utils/react'

const { clamp } = require('js-validators-and-utils')
```

| Entry                                | What it contains        |
| ------------------------------------ | ----------------------- |
| `js-validators-and-utils`            | Every non-React utility |
| `js-validators-and-utils/array`      | Array helpers           |
| `js-validators-and-utils/object`     | Object helpers          |
| `js-validators-and-utils/string`     | String helpers          |
| `js-validators-and-utils/number`     | Number helpers          |
| `js-validators-and-utils/date`       | Date helpers            |
| `js-validators-and-utils/function`   | Function helpers        |
| `js-validators-and-utils/async`      | Promise helpers         |
| `js-validators-and-utils/browser`    | Browser helpers         |
| `js-validators-and-utils/format`     | Display formatting      |
| `js-validators-and-utils/validators` | Validators              |
| `js-validators-and-utils/http`       | `fetchWrapper`          |
| `js-validators-and-utils/react`      | React hooks             |

Category imports stay smaller than the root bundle. The root ESM file is still tree-shakeable, and it does not import React.

TypeScript consumers get declaration files, generics, and the exported result types `PasswordMatchResult`, `PasswordStrength`, `PhoneLocale`, `SluggifyOptions`, `DebouncedFunction`, `FetchOptions`, and `FetchError`.

## Validators

### `isValidEmail(email: string): boolean`

Returns true for a practical email address. Consecutive dots, surrounding spaces, and a missing domain are rejected.

```ts
isValidEmail('user@example.com') // true
isValidEmail('a..b@example.com') // false
```

### `isPasswordMatched(password, confirmPassword, minLength): PasswordMatchResult`

Compares two strings and reports length separately from equality. Both flags can be true or false together.

```ts
isPasswordMatched('secret12', 'secret12', 8)
// { isTooShort: false, isMatched: true }
```

`minLength` must be a finite number.

### `isStrongPassword(password, minChars = 2, minSymbols = 2, minNumbers = 2): PasswordStrength`

Reports which rules passed. It does not throw for a weak password. The symbol property is spelled `hasSymble` so existing callers keep working. Counted symbols are `$&+,:;=?@#|'<>.^*()%!-`.

```ts
isStrongPassword('Abc$d@123')
// { hasChar: true, hasSymble: true, hasNumber: true, hasUppercase: true }
```

### `isValidURL(url: string): boolean`

Returns true for an absolute `http`, `https`, or `ftp` URL, including ports and `localhost`. This checks syntax, not whether the host is safe to request.

```ts
isValidURL('https://example.com:3000/docs') // true
isValidURL('javascript:alert(1)') // false
```

### `isValidPhoneNumber(phoneNumber: string | number, locale): boolean`

Matches the number against a built-in locale pattern. Unknown locales return false. Pass a string when the number has a leading zero.

```ts
isValidPhoneNumber('01740000000', 'bn-BD') // true
isValidPhoneNumber('123-457-8900', 'us-US') // true
```

`locale` is typed as `PhoneLocale`, so editors can suggest the supported locale codes, and a plain `string` is still accepted.

### `isValidDate(date: string): boolean`

Returns true only for a real `YYYY-MM-DD` calendar day.

```ts
isValidDate('2024-02-29') // true
isValidDate('2023-02-29') // false
```

### `isValidUserName(userName: string, disallowedWords?: string[]): boolean`

Allows 3–20 characters of letters, numbers, and underscores. A disallowed word must match the whole username, ignoring case. `admin123` is allowed when the disallowed word is `admin`.

```ts
isValidUserName('myUsername', ['admin', 'root']) // true
isValidUserName('Admin') // false
```

### `isValidFileExtension(allowedExtensions: string[], fileName: string): boolean`

Compares the final extension, ignoring case. A leading dot in the allow-list is optional. Throws when the allow-list is empty or the file name has no extension.

```ts
isValidFileExtension(['.PNG', 'jpg'], 'photo.png') // true
```

### `isEmpty(value: unknown): boolean`

True for `null`, `undefined`, `''`, `[]`, `{}`, and empty maps and sets. `0` and `false` are not empty.

```ts
isEmpty([]) // true
isEmpty(0) // false
```

### `isBlank(value: unknown): boolean`

True when the value is not a string or contains only whitespace.

```ts
isBlank('   ') // true
```

### `isNumeric(value: unknown): boolean` and `isInteger(value: unknown): value is number`

`isNumeric` accepts finite numbers and numeric strings. `isInteger` accepts only integer numbers.

```ts
isNumeric('12.5') // true
isInteger(3) // true
isInteger('3') // false
```

### `isValidJSON(value: string): boolean`

```ts
isValidJSON('{"ok":true}') // true
```

### `isHexColor(value: string): boolean`

Accepts `#RGB`, `#RGBA`, `#RRGGBB`, and `#RRGGBBAA`.

```ts
isHexColor('#1a2b3c') // true
```

### `isCreditCard(value: string): boolean`

Checks 13–19 digits with the Luhn algorithm. Spaces and dashes are ignored.

```ts
isCreditCard('4242 4242 4242 4242') // true
```

## Array

All array helpers return a new array unless a note says otherwise.

| Function                       | Returns               | Example                                                    |
| ------------------------------ | --------------------- | ---------------------------------------------------------- |
| `chunkArray(array, size = 1)`  | `T[][]`               | `chunkArray([1, 2, 3, 4, 5], 2)` → `[[1, 2], [3, 4], [5]]` |
| `flattenArray(array, depth)`   | `T[]`                 | `flattenArray([1, [2, [3]]], 2)` → `[1, 2, 3]`             |
| `shuffleArray(array, random?)` | `T[]`                 | `shuffleArray([1, 2, 3])`                                  |
| `unique(array, iteratee?)`     | `T[]`                 | `unique([{ id: 1 }, { id: 1 }], item => item.id)`          |
| `groupBy(array, iteratee)`     | `Record<string, T[]>` | `groupBy(users, user => user.role)`                        |
| `sortBy(array, iteratee)`      | `T[]`                 | `sortBy(users, user => user.name)`                         |
| `partition(array, predicate)`  | `[T[], T[]]`          | `partition([1, 2, 3], n => n % 2 === 0)`                   |
| `difference(array, ...others)` | `T[]`                 | `difference([1, 2, 3], [2])` → `[1, 3]`                    |
| `intersection(...arrays)`      | `T[]`                 | `intersection([1, 2], [2, 3])` → `[2]`                     |
| `compact(array)`               | `T[]`                 | `compact([0, null, 1])` → `[0, 1]`                         |

`flattenArray` returns the same reference when `depth` is `0` or less, and when the array is empty. `chunkArray` throws if `size` is not a positive integer. `sortBy` keeps the original order for equal keys and places `null`, `undefined`, and `NaN` last. `compact` removes only `null` and `undefined`.

```ts
const pages = chunkArray(rows, 20)
const [even, odd] = partition(pages[0] ?? [], value => value % 2 === 0)
```

## Object

| Function                          | Returns           | Example                                       |
| --------------------------------- | ----------------- | --------------------------------------------- |
| `deepClone(value)`                | same data type    | `deepClone({ user: { name: 'Ada' } })`        |
| `deepMerge(a, b, c?)`             | merged object     | `deepMerge({ a: { b: 1 } }, { a: { c: 2 } })` |
| `isEqual(left, right)`            | `boolean`         | `isEqual({ a: [1] }, { a: [1] })`             |
| `pick(object, keys)`              | `Pick<T, K>`      | `pick(user, ['id', 'name'])`                  |
| `omit(object, keys)`              | `Omit<T, K>`      | `omit(user, ['password'])`                    |
| `getPath(input, path, fallback?)` | `T \| undefined`  | `getPath(user, 'profile.name', 'Guest')`      |
| `setPath(input, path, value)`     | copy of the input | `setPath(user, 'profile.name', 'Grace')`      |

`deepClone` copies plain objects, arrays, dates, regular expressions, maps, and sets, including cycles. Class instances and functions are returned as-is. `deepMerge` merges nested plain objects, replaces arrays, skips `undefined`, and does not mutate its arguments. `isEqual` treats `NaN` as equal to `NaN` and `0` as equal to `-0`.

```ts
const next = setPath(state, 'items[1].done', true)
const name = getPath(next, 'items[1].title', 'Untitled')
```

## String

| Function                                      | Returns  | Example                                                                |
| --------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `capitalizeString(value)`                     | `string` | `capitalizeString('hello world')` → `'Hello World'`                    |
| `capitalize(value)`                           | `string` | `capitalize('hELLO')` → `'HELLO'`                                      |
| `truncatedString(value, start = 0, end = 30)` | `string` | `truncatedString(title)` → a 30-character slice plus `...` when needed |
| `sluggifiedString(value, options?)`           | `string` | `sluggifiedString('Café Menu!')` → `'cafe-menu'`                       |
| `camelCase(value)`                            | `string` | `camelCase('hello world')` → `'helloWorld'`                            |
| `snakeCase(value)`                            | `string` | `snakeCase('helloWorld')` → `'hello_world'`                            |
| `kebabCase(value)`                            | `string` | `kebabCase('helloWorld')` → `'hello-world'`                            |
| `wordCount(value)`                            | `number` | `wordCount('one two  three')` → `3`                                    |
| `escapeHtml(value)`                           | `string` | `escapeHtml('<b>Ada & Grace</b>')`                                     |

`capitalizeString` capitalizes each word and keeps repeated spaces between words. `capitalize` changes only the first character. `sluggifiedString` throws for a blank string. Options are `separator`, `removeStopWords`, `stopWords`, `case` (`'lower' | 'upper' | 'title'`), and `maxLength`.

```ts
const slug = sluggifiedString('This is a Sample Title', {
  removeStopWords: true,
  stopWords: ['is', 'a'],
  maxLength: 24
})
```

## Number

| Function                                   | Returns    | Example                      |
| ------------------------------------------ | ---------- | ---------------------------- |
| `clamp(value, min, max)`                   | `number`   | `clamp(12, 0, 10)` → `10`    |
| `roundTo(value, decimals = 0)`             | `number`   | `roundTo(1.005, 2)` → `1.01` |
| `inRange(value, min, max)`                 | `boolean`  | `inRange(5, 1, 5)` → `true`  |
| `randomInt(min, max, random?)`             | `number`   | `randomInt(1, 6)`            |
| `sum(values)`                              | `number`   | `sum([1, 2, 3])` → `6`       |
| `average(values)`                          | `number`   | `average([2, 4])` → `3`      |
| `range(end)` or `range(start, end, step?)` | `number[]` | `range(1, 4)` → `[1, 2, 3]`  |

`range` excludes the end, matching `range(4)` → `[0, 1, 2, 3]`. Bounds are inclusive for `clamp`, `inRange`, and `randomInt`. `average([])` throws.

## Date

Date math uses the local calendar. Invalid calculation inputs throw `Error('Invalid date.')`. Comparison helpers return false for an invalid date instead of throwing.

| Function                                          | Returns   | Example                                                        |
| ------------------------------------------------- | --------- | -------------------------------------------------------------- |
| `dateFormatter(date, options?, locale = 'en-US')` | `string`  | `dateFormatter('2023-09-06T14:30:00')` → `'September 6, 2023'` |
| `formatRelative(date, base = now, locale = 'en')` | `string`  | `formatRelative(yesterday, today)` → `'yesterday'`             |
| `addDays(date, amount)`                           | `Date`    | `addDays('2024-01-31', 1)`                                     |
| `addMonths(date, amount)`                         | `Date`    | January 31 plus one month lands on February 28 or 29           |
| `startOfDay(date)` / `endOfDay(date)`             | `Date`    | local `00:00:00.000` and `23:59:59.999`                        |
| `isSameDay(left, right)`                          | `boolean` | same local calendar day                                        |
| `isBefore(left, right)` / `isAfter(left, right)`  | `boolean` | strict time comparison                                         |
| `diffInDays(from, to)`                            | `number`  | `diffInDays('2024-03-09', '2024-03-11')` → `2`                 |

`dateFormatter('')` returns `''`. An unparseable date returns `'Invalid Date'`. A locale rejected by `Intl` returns `'Invalid Date format'`. `diffInDays` counts calendar days, so a daylight-saving transition does not change the result. `formatRelative` uses `Intl.RelativeTimeFormat`.

```ts
const due = addDays(startOfDay(new Date()), 7)
const label = formatRelative(due)
```

## Function

### `debounce(func, delay = 300)`

Returns a function that calls `func` with the latest arguments and `this` after `delay` quiet milliseconds. The return value has `cancel()` and `flush()`.

```ts
const save = debounce((value: string) => persist(value), 300)
input.addEventListener('input', event => {
  save((event.target as HTMLInputElement).value)
})
```

### `throttle(func, wait, options?)`

Calls `func` at most once per window. `options.leading` and `options.trailing` default to `true`. The return value has `cancel()`.

```ts
const onScroll = throttle(() => updatePosition(), 100)
```

### `memoize(func, resolver?)`

Caches return values. Primitive arguments get a stable key. Objects use `JSON.stringify` unless you pass a resolver. The function exposes `.cache`.

```ts
const getUser = memoize(async (id: string) => fetchUser(id))
```

### `once(func)`

Invokes `func` on the first call and returns that result afterward.

```ts
const connect = once(() => openDatabase())
```

### `pipe(...fns)` and `compose(...fns)`

`pipe` runs left to right. `compose` runs right to left. Overloads preserve the types for up to four functions.

```ts
pipe(
  (n: number) => n * 2,
  (n: number) => n + 1
)(3) // 7
```

## Async

| Function                                          | Returns         | Example                                       |
| ------------------------------------------------- | --------------- | --------------------------------------------- |
| `sleep(ms)`                                       | `Promise<void>` | `await sleep(250)`                            |
| `withTimeout(promise, ms, message?)`              | `Promise<T>`    | `await withTimeout(fetch(url), 1000)`         |
| `mapLimit(items, limit, mapper)`                  | `Promise<R[]>`  | `await mapLimit(ids, 3, id => fetchUser(id))` |
| `retry(operation, maxRetries, delayMs, options?)` | `Promise<T>`    | `await retry(load, 3, 200)`                   |

`retry` makes `maxRetries` total attempts. By default it writes `Attempt N failed: ...` to `console.error`. Pass `{ onError }` to replace that log. `mapLimit` preserves result order and runs at most `limit` mappers at once.

## HTTP

### `fetchWrapper(url: string, options?: FetchOptions): Promise<unknown>`

Fetches JSON when the content type contains `application/json`, and text otherwise. A non-2xx response rejects with `FetchError`, which includes `status`. Network failures reject with the original error.

When `options` is omitted, the request uses `GET` and `Content-Type: application/json`. Options you pass replace that default. They are not merged.

```ts
try {
  const post = await fetchWrapper('https://example.com/posts/1')
} catch (error) {
  if (error instanceof FetchError) console.error(error.status)
}
```

## Browser

These helpers do nothing harmful during server rendering. `readStorage`, `writeStorage`, and `removeStorage` accept a storage object, which makes them easy to test and lets you pass `sessionStorage`.

```ts
readStorage('theme', 'light')
writeStorage('theme', { mode: 'dark' })
parseQuery(location.search) // { page: '2', tag: ['js', 'ts'] }
stringifyQuery({ page: 2, tag: ['js', 'ts'] }) // 'page=2&tag=js&tag=ts'
await copyToClipboard(location.href) // false when clipboard access is unavailable
isBrowser()
```

`parseQuery` accepts a query string or a full URL. Repeated keys become arrays. `stringifyQuery` omits `null` and `undefined`.

## Format

```ts
formatNumber(1234.5, 'en-US') // '1,234.5'
formatCurrency(12.5, 'USD', 'en-US') // '$12.50'
formatBytes(1536) // '1.5 KB'
pluralize(1, 'file') // '1 file'
pluralize(2, 'person', 'people') // '2 people'
```

`formatBytes` uses 1024-based units. `pluralize` applies a small English plural rule and accepts an irregular plural.

## React

Import hooks from the React entry inside a client component. The core package does not depend on React.

```tsx
import {
  useDebounce,
  useLocalStorage,
  useToggle
} from 'js-validators-and-utils/react'

function SearchBox() {
  const [query, setQuery] = useLocalStorage('query', '')
  const debounced = useDebounce(query, 300)
  const [open, toggle] = useToggle(false)

  return (
    <input value={query} onChange={event => setQuery(event.target.value)} />
  )
}
```

| Hook                                        | Returns                     | Notes                                                                                      |
| ------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| `useDebounce(value, delay = 300)`           | `T`                         | The first render returns `value` immediately.                                              |
| `useToggle(initial = false)`                | `[value, toggle, setValue]` | `toggle` flips the boolean.                                                                |
| `usePrevious(value)`                        | `T \| undefined`            | `undefined` on the first render.                                                           |
| `useIsMounted()`                            | `() => boolean`             | Check it after an async call before setting state.                                         |
| `useLocalStorage(key, initialValue)`        | `[value, setValue, remove]` | Reads storage after mount so server HTML can use `initialValue`. Values must be JSON data. |
| `useMediaQuery(query)`                      | `boolean`                   | `false` when `matchMedia` is unavailable.                                                  |
| `useClickOutside(ref, handler)`             | `void`                      | Pointer events outside the element call `handler`.                                         |
| `useClipboard(resetAfter = 2000)`           | `{ copied, error, copy }`   | `copied` returns to false after the timeout.                                               |
| `useEventListener(event, handler, target?)` | `void`                      | Defaults to `window`. `null` skips the subscription. The latest handler is always called.  |

## Scripts

```bash
npm test              # unit tests
npm run test:coverage # tests with coverage gates
npm run lint
npm run typecheck
npm run build         # ESM, CommonJS, and declaration files
npm run check:consumer
npm run smoke
```

Coverage gates are 95% statements, 90% branches, 97% lines, and 100% functions. Hooks and browser code are included.

## Versioning and releases

Versions follow SemVer. The public contract is the root exports and the category exports above. Internal file paths can change.

1. Update `CHANGELOG.md`.
2. Bump `version` in `package.json`: patch for a fix, minor for a compatible addition, major for a breaking change.
3. Use a conventional commit such as `feat:`, `fix:`, or `docs:`. Commitlint checks the message.
4. Tag the release, for example `v2.0.0`, and push the tag.

The release workflow runs the tests and build, then publishes to npm with provenance. The repository secret `NPM_TOKEN` must be an automation token with permission to publish this package.

## Contributing

```bash
git clone git@github.com:kobir1989/js-validators-and-utils.git
cd js-validators-and-utils
npm install
```

Add the utility in the matching category, export it from that category and from `src/index.ts` when it is not React-specific, and cover normal input, invalid input, and errors. Run `npm test` and `npm run lint` before opening a pull request. The pre-commit hook typechecks and lints. React hooks stay in `src/react` and out of the root entry.
