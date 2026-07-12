import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` and behaves exactly like it on success. On failure it pretends that no input
 * was consumed: the failure's `pos` is reset to the entry position, while `span` still covers the
 * attempted region.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser`
 */
export function attempt<T>(parser: Parser<T>): Parser<T> {
  return {
    parse(ctx) {
      const start = ctx.pos

      const result = parser.parse(ctx)

      if (result === FAIL) {
        ctx.errorPos = start
      }

      return result
    },
  }
}
