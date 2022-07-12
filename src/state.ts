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
