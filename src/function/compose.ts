type Unary = (value: never) => unknown

/**
 * Calls functions from right to left. `compose(f, g)(value)` is `f(g(value))`.
 *
 * @example compose((n: number) => n + 1, (n: number) => n * 2)(3) // 7
 */
export function compose<A, B>(ab: (value: A) => B): (value: A) => B
export function compose<A, B, C>(
  bc: (value: B) => C,
  ab: (value: A) => B
): (value: A) => C
export function compose<A, B, C, D>(
  cd: (value: C) => D,
  bc: (value: B) => C,
  ab: (value: A) => B
): (value: A) => D
export function compose<A, B, C, D, E>(
  de: (value: D) => E,
  cd: (value: C) => D,
  bc: (value: B) => C,
  ab: (value: A) => B
): (value: A) => E
export function compose(
  ...fns: Array<(value: never) => unknown>
): (value: unknown) => unknown {
  return (input: unknown) =>
    fns.reduceRight((value, fn) => (fn as Unary)(value as never), input)
}

/**
 * Calls functions from left to right. `pipe(f, g)(value)` is `g(f(value))`.
 *
 * @example pipe((n: number) => n * 2, (n: number) => n + 1)(3) // 7
 */
export function pipe<A, B>(ab: (value: A) => B): (value: A) => B
export function pipe<A, B, C>(
  ab: (value: A) => B,
  bc: (value: B) => C
): (value: A) => C
export function pipe<A, B, C, D>(
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D
): (value: A) => D
export function pipe<A, B, C, D, E>(
  ab: (value: A) => B,
  bc: (value: B) => C,
  cd: (value: C) => D,
  de: (value: D) => E
): (value: A) => E
export function pipe(
  ...fns: Array<(value: never) => unknown>
): (value: unknown) => unknown {
  return (input: unknown) =>
    fns.reduce((value, fn) => (fn as Unary)(value as never), input)
}
