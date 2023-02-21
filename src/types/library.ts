/** Represents some range in the source input we are parsing or parsed. */
export type Span = [start: number, end: number]

/** Parsers of this type always succeed, e.g. `many` and `sepBy`. */
export interface SucceedingParser<T> {
  parse(input: string, pos: number): Success<T>
}

/** Parsers of this type always fail. */
export interface FailingParser {
  parse(input: string, pos: number): Failure
}

/** Parsers of this type may fail. */
export interface UnsafeParser<T> {
  parse(input: string, pos: number): Result<T>
}

/** Parser interface that all parsers and combinators consume and resolve to. */
export type Parser<T> = FailingParser | SucceedingParser<T> | UnsafeParser<T>

/** Represents failed execution. */
export type Failure = {
  readonly isOk: false
  readonly span: Span
  readonly pos: number
  readonly expected: string
}

/** Represents successful execution. */
export type Success<T> = {
  readonly isOk: true
  readonly span: Span
  readonly pos: number
  readonly value: T
}

/** Interface describing the result of parsers and combinators execution. */
export type Result<T> = Success<T> | Failure
