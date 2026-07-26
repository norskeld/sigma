import type { Parser, Result } from '@types'
import { EMPTY_ERRORS, FAIL, ParseContext } from '@types'

/** @internal */
interface Runnable<T> {
  with(input: string): Result<T>
}

/**
 * Runs a parser with provided input. The result carries the failures recovered from on `errors`,
 * so a recovered parse is successful with a non-empty `errors`.
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
      const errors = ctx.errors.length === 0 ? EMPTY_ERRORS : ctx.errors

      // `fatal` on the success path means a hand-written combinator swallowed a committed failure.
      if (value === FAIL || ctx.fatal) {
        return {
          isOk: false,
          start: ctx.errorStart,
          end: ctx.errorEnd,
          pos: ctx.errorPos,
          expected: ctx.expected,
          label: ctx.label,
          errors,
        }
      }

      return {
        isOk: true,
        start: 0,
        end: ctx.pos,
        pos: ctx.pos,
        value,
        errors,
      }
    },
  }
}
