import type { Parser } from '@types'
import { FAIL } from '@types'

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
  expected: string,
): Parser<T> {
  return {
    parse(ctx) {
      const start = ctx.pos

      const result = parser.parse(ctx)
      if (result === FAIL) return FAIL

      if (fn(result as T)) {
        return result
      }

      // The reported span covers the rejected value, but the position is rewound.
      const end = ctx.pos
      ctx.pos = start

      return ctx.fail(expected, end)
    },
  }
}
