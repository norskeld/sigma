import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Parses *zero* or more occurrences of `parser`, separated by `sep`. Never fails on its own, but a
 * committed failure from `parser` or `sep` propagates.
 *
 * @param parser - Parser to apply
 * @param sep - Separating parser
 *
 * @returns List of values (without separator) returned by `parser`
 */
export function sepBy<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const outer = ctx.mark()
      const first = parser.parse(ctx)

      if (first === FAIL) {
        if (ctx.fatal) {
          return FAIL
        }

        ctx.reset(outer)

        return []
      }

      // If the parser succeeds, run the separator and parser pairwise many times.
      const values: Array<T> = [first as T]
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        // Marked per iteration, so recoveries from successful pairs are kept.
        const mark = ctx.mark()
        const resultS = sep.parse(ctx)

        if (resultS === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.reset(mark)

          break
        }

        const resultV = parser.parse(ctx)

        if (resultV === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.pos = last
          ctx.reset(mark)

          break
        }

        // The progress guard covers the whole sep-value pair to discard zero-width matches.
        if (ctx.pos <= last) {
          ctx.pos = last
          ctx.reset(mark)

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
 * Parses *one* or more occurrences of `parser`, separated by `sep`. A committed failure from
 * `parser` or `sep` propagates.
 *
 * @param parser - Parser to apply
 * @param sep - Separating parser
 *
 * @returns List of values (without separator) returned by `parser`
 */
export function sepBy1<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const first = parser.parse(ctx)

      if (first === FAIL) {
        return FAIL
      }

      // If the parser succeeds, run the separator and parser pairwise many times.
      const values: Array<T> = [first as T]
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        // Marked per iteration, so recoveries from successful pairs are kept.
        const mark = ctx.mark()
        const resultS = sep.parse(ctx)

        if (resultS === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.reset(mark)

          break
        }

        const resultV = parser.parse(ctx)

        if (resultV === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.pos = last
          ctx.reset(mark)

          break
        }

        // The progress guard covers the whole sep-value pair to discard zero-width matches.
        if (ctx.pos <= last) {
          ctx.pos = last
          ctx.reset(mark)

          break
        }

        values.push(resultV as T)
        last = ctx.pos
      }

      return values
    },
  }
}
