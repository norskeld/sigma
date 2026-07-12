import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` without consuming any input and succeeds with `null` only if it fails, i.e.
 * acts as negative lookahead. If `parser` succeeds, fails with `expected`.
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

      const result = parser.parse(ctx)

      if (result === FAIL) {
        return null
      }

      // The reported span covers the unexpected match, but the position is rewound.
      const end = ctx.pos
      ctx.pos = start

      return ctx.fail(expected, end)
    },
  }
}
