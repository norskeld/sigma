import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser`, falling back to `null` if it fails. Never fails on its own, but a committed
 * failure from `parser` propagates.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser` or `null`
 */
export function optional<T>(parser: Parser<T>): Parser<T | null> {
  return {
    parse(ctx) {
      const mark = ctx.mark()
      const result = parser.parse(ctx)

      if (result !== FAIL) {
        return result
      }

      if (ctx.fatal) {
        return FAIL
      }

      ctx.reset(mark)

      return null
    },
  }
}
