import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` exactly `n` times and collects the values. Fails with the first failure of
 * `parser`. Resolves to an empty array if `n` is less than one.
 *
 * @param parser - Parser to apply
 * @param n - Number of times to apply `parser`
 *
 * @returns Array of values returned by `parser`
 */
export function count<T>(parser: Parser<T>, n: number): Parser<Array<T>> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const values: Array<T> = []

      for (let index = 0; index < n; index++) {
        const result = parser.parse(ctx)

        if (result === FAIL) {
          ctx.pos = start
          return FAIL
        }

        values.push(result as T)
      }

      return values
    },
  }
}
