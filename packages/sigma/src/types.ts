/** Parsers of this type always succeed, e.g. `many` and `sepBy`. */
export interface SafeParser<T> {
  parse(input: string, pos: number): Success<T>
}

/** Parsers of this type may fail. */
export interface UnsafeParser<T> {
  parse(input: string, pos: number): Result<T>
}

/** Parser interface that all parsers and combinators consume and resolve to. */
export type Parser<T> = SafeParser<T> | UnsafeParser<T>

/** Represents failed execution. */
export type Failure = {
  readonly isOk: false
  readonly pos: number
  readonly expected: string
}

/** Represents successful execution. */
export type Success<T> = {
  readonly isOk: true
  readonly pos: number
  readonly value: T
}

/** Interface describing the result of parsers and combinators execution. */
export type Result<T> = Success<T> | Failure

// Utility types.

/**
 * Given a tuple of `Parser<T>`s, recursively extracts inner `T`s into a tuple.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>]
 * type R = ToTuple<U> // type R = [string, number, boolean]
 * ```
 */
export type ToTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...ToTuple<Tail>]
  : []

/**
 * Given a tuple of `Parser<T>`s, recursively extracts inner `T`s into a union.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>]
 * type R = ToUnion<U> // type R = string | number | boolean
 * ```
 */
export type ToUnion<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? Head | ToUnion<Tail>
  : never

/**
 * Given a union of `Parser<T>`s, recursively extracts their inner `T`s into a tuple.
 *
 * @example
 *
 * ```ts
 * type U = Parser<string> | Parser<number> | Parser<boolean>
 * type R = UnwrapUnion<U> // type R = [string, number, boolean]
 * ```
 */
export type UnwrapUnion<T> = T extends Parser<infer Head> | Parser<infer Tail>
  ? [Head, ...UnwrapUnion<Tail>]
  : []

/**
 * Given a union of `Parser<T>`s, folds it into a single`Parser` with a union of inner `T`s.
 * In other words, it folds `Parser<T1> | Parser<T2> | ...` into `Parser<T1 | T2 | ...>`.
 *
 * Note: Technically, the result will be `SafeParser<T1 | T2 | ...> | UnsafeParser<T1 | T2 | ...>`,
 * but no worries, it's the definition of the `Parser<T>`.
 *
 * @example
 *
 * ```ts
 * type U = Parser<string> | Parser<number> | Parser<boolean>
 * type R = ToParser<U> // type R = Parser<string, number, boolean>
 * ```
 */
export type ToParser<T> = UnwrapUnion<T> extends [infer R] ? Parser<R> : Parser<unknown>
