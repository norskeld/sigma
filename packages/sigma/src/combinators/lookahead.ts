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
      const result = parser.parse(ctx)

      if (result !== FAIL) {
        ctx.pos = start
      }

      return result
    },
  }
}
