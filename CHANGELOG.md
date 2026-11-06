# Changelog

This project follows [Semantic Versioning](https://semver.org/).

## 2.0.1

Require Node.js greater than 20. Continuous integration now runs on Node.js 22 and 24.

## 2.0.0

The maintained toolkit starts at 2.0.0. Function names and result shapes are the same, and a few behaviors now match the documented contracts. Node.js 18 or newer is required.

### Added

- Category entry points: `array`, `object`, `string`, `number`, `date`, `function`, `async`, `browser`, `format`, `validators`, `http`, and `react`.
- Array helpers: `unique`, `groupBy`, `sortBy`, `partition`, `difference`, `intersection`, `compact`.
- Object helpers: `deepClone`, `deepMerge`, `isEqual`, `pick`, `omit`, `getPath`, `setPath`.
- String helpers: `capitalize`, `camelCase`, `snakeCase`, `kebabCase`, `wordCount`, `escapeHtml`.
- Number helpers: `clamp`, `roundTo`, `inRange`, `randomInt`, `sum`, `average`, `range`.
- Date helpers: `formatRelative`, `addDays`, `addMonths`, `startOfDay`, `endOfDay`, `isSameDay`, `isBefore`, `isAfter`, `diffInDays`.
- Function helpers: `throttle`, `memoize`, `once`, `compose`, `pipe`. `debounce` now also has `cancel` and `flush`.
- Async helpers: `sleep`, `withTimeout`, `mapLimit`.
- Browser helpers: `isBrowser`, `readStorage`, `writeStorage`, `removeStorage`, `parseQuery`, `stringifyQuery`, `copyToClipboard`.
- Format helpers: `formatBytes`, `formatNumber`, `formatCurrency`, `pluralize`.
- Validators: `isEmpty`, `isBlank`, `isNumeric`, `isInteger`, `isValidJSON`, `isHexColor`, `isCreditCard`.
- React hooks, imported from `js-validators-and-utils/react`: `useDebounce`, `useToggle`, `usePrevious`, `useIsMounted`, `useLocalStorage`, `useMediaQuery`, `useClickOutside`, `useClipboard`, `useEventListener`.
- Dual ESM and CommonJS builds, declaration files, CI, and a tag-based npm publish workflow.

### Fixed

- `fetchWrapper` rejects on HTTP and network failures. The published examples already used `try/catch`, but the old implementation resolved with the error object.
- `flattenArray` now walks each nested array by its own length.
- `chunkArray` throws when `size` is not a positive integer, instead of looping forever for `0`.
- `capitalizeString` no longer throws when a word is separated by more than one space.
- `sluggifiedString` removes accents and punctuation, then collapses repeated separators.
- `isValidURL` accepts valid absolute `http`, `https`, and `ftp` URLs, including ports and `localhost`.
- `isValidEmail` rejects consecutive dots and a local part that starts or ends with a dot.
- `isValidDate` checks the calendar day directly, so impossible dates do not depend on host timezone parsing.
- `isValidPhoneNumber` accepts a finite number as well as a string. Leading zeros still require a string.
- `isValidFileExtension` compares extensions case-insensitively and allows a leading dot in the allow-list.
- `isValidUserName` compares disallowed words case-insensitively. A word must still match the whole username.
- `shuffleArray` no longer mutates its input. An optional random source makes tests deterministic.

### Unchanged on purpose

- Existing function names, including `sluggifiedString`, `truncatedString`, and `dateFormatter`.
- `isStrongPassword` still returns `hasSymble`.
- `isPasswordMatched` still returns `{ isTooShort, isMatched }`.
- `retry` still treats `maxRetries` as the total number of attempts and still logs failures with `console.error` unless an `onError` callback is provided.
- React is not imported by the main entry. Install `react` only if you import `js-validators-and-utils/react`.
