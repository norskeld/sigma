import type { Failure, Parser, Span, Success } from '@types'
import { FAIL, ParseContext } from '@types'

/** @internal */
interface Runnable<T> {
  with(input: string): Success<T>
}

/** @internal */
type ErrorResult = Omit<Failure, 'isOk'>

export class ParserError extends Error {
  readonly name = 'ParserError'

  readonly span: Span
  readonly pos: number

  constructor(res: ErrorResult) {
    super(res.expected)

    this.span = { start: res.start, end: res.end }
    this.pos = res.pos
  }
}

/**
 * Runs a parser with provided input, throwing on failure.
 *
 * @param parser - Parser to run
 * @throws {@link ParserError} Parser error with `message` (`expected`) `span`, and `pos`
 *
 * @returns Parser result
 */
export function tryRun<T>(parser: Parser<T>): Runnable<T> {
  return {
    with(input) {
      const ctx = new ParseContext(input)
      const value = parser.parse(ctx)

      if (value === FAIL) {
        throw new ParserError({
          start: ctx.errorStart,
          end: ctx.errorEnd,
          pos: ctx.errorPos,
          expected: ctx.expected,
        })
      }

      return {
        isOk: true,
        start: 0,
        end: ctx.pos,
        pos: ctx.pos,
        value: value as T,
      }
    },
  }
}
