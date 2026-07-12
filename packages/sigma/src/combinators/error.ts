import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Replaces `parser`'s error message with `expected`.
 *
 * @param parser - Parser of which error message should be replaced
 * @param expected - New error message
 *
 * @returns Unchanged `parser`'s result or failure with new error message
 */
export function error<T>(parser: Parser<T>, expected: string): Parser<T> {
  return {
    parse(ctx) {
      const result = parser.parse(ctx)

      if (result === FAIL) {
        ctx.expected = expected
      }

      return result
    },
  }
}
