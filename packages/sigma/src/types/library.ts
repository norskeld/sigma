/** Represents some range in the source input we are parsing or parsed. */
export interface Span {
  readonly start: number
  readonly end: number
}

/** Sentinel returned by parsers on failure. Reserved: never return it as a parser value. */
export const FAIL: unique symbol = Symbol('sigma.FAIL')

/** Type of the {@link FAIL} sentinel. */
export type Fail = typeof FAIL

/**
 * Mutable state shared by all parsers during a single run. Holds the cursor and a mirror of the
 * failure that would be reported if the parse stopped now.
 *
 * Invariants: a parser that returns {@link FAIL} must leave `pos` at its entry value and the error
 * fields describing its failure. On success the error fields are unspecified.
 */
export class ParseContext {
  input: string
  pos: number
  errorPos: number
  errorStart: number
  errorEnd: number
  expected: string

  constructor(input: string) {
    this.input = input
    this.pos = 0
    this.errorPos = 0
    this.errorStart = 0
    this.errorEnd = 0
    this.expected = ''
  }

  /** Records a failure at the current position and returns {@link FAIL}. */
  fail(expected: string, end: number = this.pos): Fail {
    this.expected = expected
    this.errorPos = this.pos
    this.errorStart = this.pos
    this.errorEnd = end
    return FAIL
  }
}

/** Parsers of this type always succeed, e.g. `many` and `sepBy`. */
export interface SucceedingParser<T> {
  parse(ctx: ParseContext): T
}

/** Parsers of this type always fail. */
export interface FailingParser {
  parse(ctx: ParseContext): Fail
}

/** Parsers of this type may fail. */
export interface UnsafeParser<T> {
  parse(ctx: ParseContext): T | Fail
}

/** Parser interface that all parsers and combinators consume and resolve to. */
export interface Parser<T> {
  parse(ctx: ParseContext): T | Fail
}

/** Represents failed execution. */
export type Failure = {
  readonly isOk: false
  readonly start: number
  readonly end: number
  readonly pos: number
  readonly expected: string
}

/** Represents successful execution. */
export type Success<T> = {
  readonly isOk: true
  readonly start: number
  readonly end: number
  readonly pos: number
  readonly value: T
}

/** Interface describing the result of parsers and combinators execution. */
export type Result<T> = Success<T> | Failure
