import type { Failure, Parser, Span, Success } from '@types'

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

    this.span = res.span
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
      const result = parser.parse(input, 0)

      switch (result.isOk) {
        case true: {
          return result
        }

        case false: {
          throw new ParserError(result)
        }
      }
    }
  }
}
