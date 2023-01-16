import type { Parser, Span } from '@types'

/**
 * Applies `fn` to the `parser`'s result.
 *
 * @param parser - Parser to apply
 * @param fn - Function to apply to `parser`'s result
 *
 * @returns Result of `fn`
 */
export function map<T, R>(parser: Parser<T>, fn: (value: T, span: Span) => R): Parser<R> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          const span = [pos, result.pos] as Span

          return {
            isOk: true,
            span,
            pos: result.pos,
            value: fn(result.value, span)
          }
        }

        case false: {
          return result
        }
      }
    }
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
  return map(parser, () => value)
}
