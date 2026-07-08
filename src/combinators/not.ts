import type { Parser } from '@types'

/**
 * Applies `parser` without consuming any input and succeeds with `null` only if it fails, i.e.
 * acts as negative lookahead. If `parser` succeeds, fails with `expected`.
 *
 * @param parser - Parser to apply
 * @param expected - Failure message to use if `parser` succeeds
 *
 * @returns `null` if `parser` fails
 */
export function not(parser: Parser<unknown>, expected = 'unexpected input'): Parser<null> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: false,
            span: result.span,
            pos,
            expected
          }
        }

        case false: {
          return {
            isOk: true,
            span: [pos, pos],
            pos,
            value: null
          }
        }
      }
    }
  }
}
