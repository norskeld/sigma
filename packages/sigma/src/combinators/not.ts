import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` without consuming any input and succeeds with `null` only if it fails, i.e.
 * acts as negative lookahead. If `parser` succeeds, fails with `expected`. A committed failure
 * escapes rather than being read as "did not match"; wrap it in `backtrack` to keep it speculative.
 *
 * @param parser - Parser to apply
 * @param expected - Failure message to use if `parser` succeeds
 *
 * @returns `null` if `parser` fails
 */
export function not(parser: Parser<unknown>, expected = 'unexpected input'): Parser<null> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const mark = ctx.mark()
      const result = parser.parse(ctx)

      if (result === FAIL) {
        // A committed failure escapes negative lookahead rather than being read as "did not match".
        if (ctx.fatal) {
          return FAIL
        }

        ctx.reset(mark)

        return null
      }

      // The reported span covers the unexpected match, but the position is rewound.
      const end = ctx.pos
      ctx.pos = start
      ctx.reset(mark)

      return ctx.fail(expected, end)
    },
  }
}
