import type { Parser } from '@types'

/**
 * Applies `parser` and tests its value with the `fn` predicate. Succeeds with the value if `fn`
 * returns `true`, otherwise fails with `expected`.
 *
 * @param parser - Parser to apply
 * @param fn - Predicate to test the value with
 * @param expected - Failure message to use if the value is rejected
 *
 * @returns Value of `parser` if it passes the predicate
 */
export function filter<T>(
  parser: Parser<T>,
  fn: (value: T) => boolean,
  expected: string
): Parser<T> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          if (fn(result.value)) {
            return result
          }

          return {
            isOk: false,
            span: result.span,
            pos,
            expected
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}
