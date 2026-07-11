import type { Parser, Span } from '@types'

/**
 * Applies `fn` to the `parser`'s result. If `fn` declares a second parameter, it receives the
 * result's {@link Span}.
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
          return {
            isOk: true,
            start: result.start,
            end: result.end,
            pos: result.pos,
            value: fn(result.value, {
              start: pos,
              end: result.pos,
            }),
          }
        }

        case false: {
          return result
        }
      }
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
  return map(parser, () => value)
}
