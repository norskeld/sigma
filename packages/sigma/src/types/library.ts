/** Represents some range in the source input we are parsing or parsed. */
export interface Span {
  readonly start: number
  readonly end: number
}

/** Sentinel returned by parsers on failure. Reserved, never return it as a parser value. */
export const FAIL: unique symbol = Symbol('sigma.FAIL')

/** Shared empty error list, so a clean parse allocates nothing extra. */
export const EMPTY_ERRORS: ReadonlyArray<Failure> = Object.freeze([])

/** Type of the {@link FAIL} sentinel. */
export type Fail = typeof FAIL

/**
 * Mutable state shared by all parsers during a single run. Holds the cursor, a mirror of the
 * failure that would be reported if the parse stopped now, and the failures recovered so far.
 *
 * Invariants:
 *
 * - A parser that returns {@link FAIL} must leave `pos` where it entered, with the error fields
 * describing its failure.
 * - Committed failures rewind `pos` like ordinary ones.
 * - On success the error fields mean nothing and `fatal` must be left false.
 * - {@link FAIL} rewinds `pos` but never `errors`, so a run that fails outright still reports what
 * it recovered.
 *
 * To swallow a {@link FAIL}, return it unchanged if `fatal` is set, otherwise {@link reset} to the
 * {@link mark} taken on entry, dropping what the discarded attempt recovered. Combinators that only
 * pass {@link FAIL} upwards do neither, whoever swallows it does.
 */
export class ParseContext {
  /** Source being parsed. */
  input: string

  /** Offset of the next character to read. */
  pos: number

  /** Offset the failure is reported at. Combinators compare it to keep the furthest failure. */
  errorPos: number

  /** Start of the span the failure highlights. */
  errorStart: number

  /** End of the span the failure highlights. May reach past {@link errorPos}. */
  errorEnd: number

  /** What the failed parser wanted to see. */
  expected: string

  /** True while a committed failure is propagating. */
  fatal: boolean

  /** Label attached by `commit`. Meaningful only while {@link fatal} is true. */
  label: string | null

  /** Failures recovered during this run. */
  readonly errors: Array<Failure>

  constructor(input: string) {
    this.input = input
    this.pos = 0
    this.errorPos = 0
    this.errorStart = 0
    this.errorEnd = 0
    this.expected = ''
    this.fatal = false
    this.label = null
    this.errors = []
  }

  /** Point in {@link errors} to rewind to if the region being parsed ends up discarded. */
  mark(): number {
    return this.errors.length
  }

  /** Discards everything recovered since {@link mark}. */
  reset(mark: number): void {
    if (this.errors.length !== mark) {
      this.errors.length = mark
    }
  }

  /** Records a recovered failure. */
  record(failure: Failure): void {
    this.errors.push(failure)
  }

  /** Records a failure at the current position and returns {@link FAIL}. */
  fail(expected: string, end: number = this.pos): Fail {
    this.expected = expected
    this.errorPos = this.pos
    this.errorStart = this.pos
    this.errorEnd = end
    return FAIL
  }

  /** Marks the failure currently in the error mirror as committed. */
  commit(label: string | null): Fail {
    this.fatal = true
    this.label = label
    return FAIL
  }

  /** Clears the committed marker. */
  uncommit(): void {
    this.fatal = false
    this.label = null
  }

  /** Snapshots the error mirror as a {@link Failure}. */
  snapshot(): Failure {
    return {
      isOk: false,
      start: this.errorStart,
      end: this.errorEnd,
      pos: this.errorPos,
      expected: this.expected,
      label: this.label,
      errors: EMPTY_ERRORS,
    }
  }

  /** Writes a snapshot back into the error mirror. */
  restore(failure: Failure): Fail {
    this.expected = failure.expected
    this.errorPos = failure.pos
    this.errorStart = failure.start
    this.errorEnd = failure.end
    return FAIL
  }
}

/** Parsers of this type always succeed, e.g. `rest`, `nothing`, `syncTo` and `syncPast`. */
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

/**
 * Represents failed execution. `errors` holds the failures recovered before the run gave up, and is
 * always empty on failures nested inside it.
 */
export type Failure = {
  readonly isOk: false
  readonly start: number
  readonly end: number
  readonly pos: number
  readonly expected: string
  readonly label: string | null
  readonly errors: ReadonlyArray<Failure>
}

/**
 * Represents successful execution. A non-empty `errors` means the parse recovered from failures.
 */
export type Success<T> = {
  readonly isOk: true
  readonly start: number
  readonly end: number
  readonly pos: number
  readonly value: T
  readonly errors: ReadonlyArray<Failure>
}

/** Interface describing the result of parsers and combinators execution. */
export type Result<T> = Success<T> | Failure
