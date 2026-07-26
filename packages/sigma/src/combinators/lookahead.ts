import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` without consuming any input on success. On failure the failure is returned as
 * is, with `pos` pointing to the deepest position reached, which yields more precise errors.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser`
 */
export function lookahead<T>(parser: Parser<T>): Parser<T> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const mark = ctx.mark()
      const result = parser.parse(ctx)

      if (result !== FAIL) {
        ctx.pos = start

        // The region will be parsed for real, so its recoveries would otherwise be reported twice.
        ctx.reset(mark)
      }

      return result
    },
  }
}
