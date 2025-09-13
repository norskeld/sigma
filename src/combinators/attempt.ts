import type { Parser } from '@types'

/**
 * Applies `parser` without consuming any input. It doesn't care if `parser` succeeds or fails, it
 * won't consume any input.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser`
 *
 * @example
 * const Parser = sequence(
 *   takeLeft(string('hello'), whitespace()),
 *   attempt(string('let')),
 *   string('lettuce')
 * )
 */
export function attempt<T>(parser: Parser<T>): Parser<T> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        // If parser succeeded, keep the position untouched.
        case true: {
          return {
            isOk: true,
            span: [pos, pos],
            pos,
            value: result.value
          }
        }

        // If parser failed, keep the position untouched as well.
        case false: {
          return {
            isOk: false,
            span: [pos, pos],
            pos,
            expected: result.expected
          }
        }
      }
    }
  }
}
