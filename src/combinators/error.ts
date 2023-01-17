import type { Parser } from '@types'

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
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          return result
        }

        case false: {
          return {
            isOk: false,
            span: [pos, result.pos],
            pos,
            expected
          }
        }
      }
    }
  }
}
