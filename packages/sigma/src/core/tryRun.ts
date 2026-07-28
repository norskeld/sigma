import type { Failure, Parser, Span, Success } from '@types'
import { EMPTY_ERRORS, FAIL, ParseContext } from '@types'

/** @internal */
interface Runnable<T> {
  with(input: string): Success<T>
}

/** @internal */
type ErrorResult = Omit<Failure, 'isOk' | 'errors'>

export class ParserError extends Error {
  readonly name = 'ParserError'

  readonly span: Span
  readonly pos: number
  readonly label: string | null

  /** Failures the run recovered from. A run that failed outright is not repeated here. */
  readonly errors: ReadonlyArray<Failure>

  constructor(res: ErrorResult, errors: ReadonlyArray<Failure> = EMPTY_ERRORS) {
    super(res.expected)

    this.span = { start: res.start, end: res.end }
    this.pos = res.pos
    this.label = res.label
    this.errors = errors
  }
}

/**
 * Runs a parser with provided input, throwing on failure and on any failure recovered from.
 *
 * @param parser - Parser to run
 * @throws {@link ParserError} Parser error with `message` (`expected`), `span`, `pos`, `label` and
 * `errors`
 *
 * @returns Parser result
 */
export function tryRun<T>(parser: Parser<T>): Runnable<T> {
  return {
    with(input) {
      const ctx = new ParseContext(input)
      const value = parser.parse(ctx)
      const errors = ctx.errors

      if (value === FAIL || ctx.fatal) {
        throw new ParserError(
          {
            start: ctx.errorStart,
            end: ctx.errorEnd,
            pos: ctx.errorPos,
            expected: ctx.expected,
            label: ctx.label,
          },
          errors.length === 0 ? EMPTY_ERRORS : errors,
        )
      }

      // Recovered failures still mean the input was invalid.
      if (errors.length !== 0) {
        throw new ParserError(errors[0], errors)
      }

      return {
        isOk: true,
        start: 0,
        end: ctx.pos,
        pos: ctx.pos,
        value: value as T,
        errors: EMPTY_ERRORS,
      }
    },
  }
}
