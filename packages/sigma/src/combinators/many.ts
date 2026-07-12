import type { Parser, SucceedingParser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` *zero* or more times, collecting its results. Successes that consume no input
 * are not collected. Never fails.
 *
 * @param parser - Parser to apply
 *
 * @returns Array of the returned values of `parser`
 */
export function many<T>(parser: Parser<T>): SucceedingParser<Array<T>> {
  return {
    parse(ctx) {
      const values: Array<T> = []
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        const result = parser.parse(ctx)
        if (result === FAIL) break

        // Zero-width successes are not collected, otherwise the loop would never terminate.
        const pos = ctx.pos
        if (pos === last) break

        values.push(result as T)
        last = pos
      }

      return values
    },
  }
}

/**
 * Applies `parser` *one* or more times, collecting its results. After the first match, successes
 * that consume no input are not collected.
 *
 * @param parser - Parser to apply
 *
 * @returns Array of the returned values of `parser`
 */
export function many1<T>(parser: Parser<T>): Parser<Array<T>> {
  return {
    parse(ctx) {
      const first = parser.parse(ctx)
      if (first === FAIL) return FAIL

      const values: Array<T> = [first as T]
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        const result = parser.parse(ctx)
        if (result === FAIL) break

        // Zero-width successes are not collected, otherwise the loop would never terminate.
        const pos = ctx.pos
        if (pos === last) break

        values.push(result as T)
        last = pos
      }

      return values
    },
  }
}
