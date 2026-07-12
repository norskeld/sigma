import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Parses *zero* or more occurrences of `parser`, separated by `sep`. Never fails.
 *
 * @param parser - Parser to apply
 * @param sep - Separating parser
 *
 * @returns List of values (without separator) returned by `parser`
 */
export function sepBy<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>> {
  return {
    parse(ctx) {
      // Run the parser once to get the first value.
      const first = parser.parse(ctx)

      if (first === FAIL) {
        return []
      }

      // If the parser succeeds, run the separator and parser pairwise many times.
      const values: Array<T> = [first as T]
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        const resultS = sep.parse(ctx)
        if (resultS === FAIL) break

        const resultV = parser.parse(ctx)

        // The progress guard covers the whole sep-value pair to discard zero-width matches.
        if (resultV === FAIL || ctx.pos <= last) {
          ctx.pos = last
          break
        }

        values.push(resultV as T)
        last = ctx.pos
      }

      return values
    },
  }
}

/**
 * Parses *one* or more occurrences of `parser`, separated by `sep`.
 *
 * @param parser - Parser to apply
 * @param sep - Separating parser
 *
 * @returns List of values (without separator) returned by `parser`
 */
export function sepBy1<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>> {
  return {
    parse(ctx) {
      // Run the parser once to get the first value.
      const first = parser.parse(ctx)
      if (first === FAIL) return FAIL

      // If the parser succeeds, run the separator and parser pairwise many times.
      const values: Array<T> = [first as T]
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        const resultS = sep.parse(ctx)
        if (resultS === FAIL) break

        const resultV = parser.parse(ctx)

        // The progress guard covers the whole sep-value pair to discard zero-width matches.
        if (resultV === FAIL || ctx.pos <= last) {
          ctx.pos = last
          break
        }

        values.push(resultV as T)
        last = ctx.pos
      }

      return values
    },
  }
}
