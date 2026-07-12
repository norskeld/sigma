import type { Parser, Result } from '@types'
import { FAIL, ParseContext } from '@types'

/** @internal */
interface Runnable<T> {
  with(input: string): Result<T>
}

/**
 * Runs a parser with provided input.
 *
 * @param parser - Parser to run
 *
 * @returns Parser result
 */
export function run<T>(parser: Parser<T>): Runnable<T> {
  return {
    with(input) {
      const ctx = new ParseContext(input)
      const value = parser.parse(ctx)

      if (value === FAIL) {
        return {
          isOk: false,
          start: ctx.errorStart,
          end: ctx.errorEnd,
          pos: ctx.errorPos,
          expected: ctx.expected,
        }
      }

      return {
        isOk: true,
        start: 0,
        end: ctx.pos,
        pos: ctx.pos,
        value,
      }
    },
  }
}
