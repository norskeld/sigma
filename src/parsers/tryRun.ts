import type { Failure, Parser, Success } from '@types'

/** @internal */
interface Runnable<T> {
  with(input: string): Success<T>
}

/** @internal */
type ErrorResult = Omit<Failure, 'isOk'>

export class ParserError extends Error {
  readonly name = 'ParserError'
  readonly pos: number
  constructor(res: ErrorResult) {
    super(res.expected)
    this.pos = res.pos
  }
}

/**
 * Runs a parser with provided input.
 * Throws on failure
 *
 * @param parser - Parser to run
 * @throws {@link ParserError} Special parser error that includes `pos` and `expected` fields
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
