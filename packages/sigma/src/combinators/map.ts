import type { Parser, Span } from '@types'
import { FAIL } from '@types'

/**
 * Applies `fn` to the `parser`'s result. `fn` also receives the result's {@link Span}.
 *
 * @param parser - Parser to apply
 * @param fn - Function to apply to `parser`'s result
 *
 * @returns Result of `fn`
 */
export function map<T, R>(parser: Parser<T>, fn: (value: T, span: Span) => R): Parser<R> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const result = parser.parse(ctx)

      if (result === FAIL) {
        return FAIL
      }

      return fn(result as T, { start, end: ctx.pos })
    },
  }
}

/**
 * Maps the `parser`'s result to a constant `value`.
 *
 * @param parser - Parser to apply
 * @param value - Value to map `parser`'s result to
 *
 * @returns `value`
 */
export function mapTo<T, R>(parser: Parser<T>, value: R): Parser<R> {
  return {
    parse(ctx) {
      const result = parser.parse(ctx)

      if (result === FAIL) {
        return FAIL
      }

      return value
    },
  }
}
