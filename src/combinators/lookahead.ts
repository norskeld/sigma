import type { Parser } from '@types'

/**
 * Applies `parser` without consuming any input, whether it succeeds or fails.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser`
 */
export function lookahead<T>(parser: Parser<T>): Parser<T> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        // If parser succeeded, keep the position untouched.
        case true: {
          return {
            isOk: true,
            span: result.span,
            pos,
            value: result.value
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}
