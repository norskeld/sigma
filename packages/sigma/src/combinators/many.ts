import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` *zero* or more times, collecting its results. Successes that consume no input
 * are not collected. Never fails on its own, but a committed failure from `parser` propagates.
 *
 * @param parser - Parser to apply
 *
 * @returns Array of the returned values of `parser`
 */
export function many<T>(parser: Parser<T>): Parser<Array<T>> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const values: Array<T> = []
      const length = ctx.input.length

      let last = start

      while (last < length) {
        // Marked per iteration, so recoveries from successful iterations are kept.
        const mark = ctx.mark()
        const result = parser.parse(ctx)

        if (result === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.reset(mark)

          break
        }

        // Zero-width successes are not collected, otherwise the loop would never terminate.
        const pos = ctx.pos

        if (pos === last) {
          ctx.reset(mark)

          break
        }

        values.push(result as T)
        last = pos
      }

      return values
    },
  }
}

/**
 * Applies `parser` *one* or more times, collecting its results. After the first match, successes
 * that consume no input are not collected. A committed failure from `parser` propagates.
 *
 * @param parser - Parser to apply
 *
 * @returns Array of the returned values of `parser`
 */
export function many1<T>(parser: Parser<T>): Parser<Array<T>> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const first = parser.parse(ctx)

      if (first === FAIL) {
        return FAIL
      }

      const values: Array<T> = [first as T]
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        // Marked per iteration, so recoveries from successful iterations are kept.
        const mark = ctx.mark()
        const result = parser.parse(ctx)

        if (result === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.reset(mark)

          break
        }

        // Zero-width successes are not collected, otherwise the loop would never terminate.
        const pos = ctx.pos

        if (pos === last) {
          ctx.reset(mark)

          break
        }

        values.push(result as T)
        last = pos
      }

      return values
    },
  }
}
