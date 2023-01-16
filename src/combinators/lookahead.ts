import type { Parser } from '@types'

/**
 * Applies `parser` without consuming any input. If `parser` fails and consumes some input, so does
 * `lookahead`.
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
            pos,
            value: result.value
          }
        }

        // If the parser failed, then still advance the pos cursor.
        case false: {
          return result
        }
      }
    }
  }
}
