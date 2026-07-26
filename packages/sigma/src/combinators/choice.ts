import type { Parser, ToUnion } from '@types'
import { FAIL } from '@types'

/**
 * Applies `ps` parsers in order until one of them succeeds.
 *
 * @param ps - Parsers to apply
 *
 * @returns Value of the succeeding parser
 */
export function choice<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToUnion<T>>
export function choice<T>(...ps: Array<Parser<T>>): Parser<T> {
  return {
    parse(ctx) {
      // It's "guaranteed" by type system that there will be at least two parsers, so I'm not gonna
      // bother checking for `ps` length and asserting it, because it would hit performance.
      const mark = ctx.mark()
      const first = ps[0].parse(ctx)

      if (first !== FAIL) {
        return first
      }

      // Bail before the error mirror is overwritten, so a commit keeps its own precise error.
      if (ctx.fatal) {
        return FAIL
      }

      // Anything this alternative recovered is discarded along with the alternative itself.
      ctx.reset(mark)

      // Keep the failure that got the furthest; the first alternative wins ties.
      let bestPos = ctx.errorPos
      let bestStart = ctx.errorStart
      let bestEnd = ctx.errorEnd
      let bestExpected = ctx.expected

      for (let index = 1; index < ps.length; index++) {
        const result = ps[index].parse(ctx)

        if (result !== FAIL) {
          return result
        }

        if (ctx.fatal) {
          return FAIL
        }

        ctx.reset(mark)

        if (ctx.errorPos > bestPos) {
          bestPos = ctx.errorPos
          bestStart = ctx.errorStart
          bestEnd = ctx.errorEnd
          bestExpected = ctx.expected
        }
      }

      ctx.errorPos = bestPos
      ctx.errorStart = bestStart
      ctx.errorEnd = bestEnd
      ctx.expected = bestExpected

      return FAIL
    },
  }
}
