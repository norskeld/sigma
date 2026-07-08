import type { Parser } from '@types'

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
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          return result
        }

        // If parser failed, reset the position to pretend no input was consumed.
        case false: {
          return {
            isOk: false,
            span: result.span,
            pos,
            expected: result.expected
          }
        }
      }
    }
  }
}
