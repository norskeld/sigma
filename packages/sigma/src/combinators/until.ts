import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies source `parser`, collects its output, and stops after `terminator` parser succeeds.
 * Fails with the `terminator`'s error if `parser` succeeds without consuming input. A committed
 * failure from either propagates.
 *
 * @param parser - Parser to apply
 * @param terminator - Terminating parser to stop after
 *
 * @returns Tuple of values collected by `parser` and `terminator`
 */
export function takeUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<[Array<T>, S]> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const values: Array<T> = []

      while (true) {
        const last = ctx.pos
        const mark = ctx.mark()
        const resultT = terminator.parse(ctx)

        if (ctx.fatal) {
          ctx.pos = start
          return FAIL
        }

        if (resultT !== FAIL) {
          return [values, resultT as S]
        }

        // The terminator's failed probe is speculative, so its recoveries are discarded.
        ctx.reset(mark)

        const resultP = parser.parse(ctx)

        if (resultP === FAIL) {
          ctx.pos = start
          return FAIL
        }

        // Guard against infinite loops on zero-width successes. The success may have overwritten
        // the error mirror, so re-fail the terminator to report its error.
        if (ctx.pos === last) {
          terminator.parse(ctx)

          // The terminator already failed uncommitted here, so the re-run is speculative.
          if (ctx.fatal) {
            ctx.uncommit()
          }

          ctx.reset(mark)
          ctx.pos = start

          return FAIL
        }

        values.push(resultP as T)
      }
    },
  }
}

/**
 * Applies source `parser`, ignores its output, and stops after `terminator` parser succeeds.
 * Fails with the `terminator`'s error if `parser` succeeds without consuming input. A committed
 * failure from either propagates.
 *
 * @param parser - Parser to apply
 * @param terminator - Terminating parser to stop after
 *
 * @returns Value of `terminator` parser
 */
export function skipUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<S> {
  return {
    parse(ctx) {
      const start = ctx.pos

      while (true) {
        const last = ctx.pos
        const mark = ctx.mark()
        const resultT = terminator.parse(ctx)

        if (ctx.fatal) {
          ctx.pos = start
          return FAIL
        }

        if (resultT !== FAIL) {
          return resultT as S
        }

        // The terminator's failed probe is speculative, so its recoveries are discarded.
        ctx.reset(mark)

        const resultP = parser.parse(ctx)

        if (resultP === FAIL) {
          ctx.pos = start
          return FAIL
        }

        // Guard against infinite loops on zero-width successes. The success may have overwritten
        // the error mirror, so re-fail the terminator to report its error.
        if (ctx.pos === last) {
          terminator.parse(ctx)

          // The terminator already failed uncommitted here, so the re-run is speculative.
          if (ctx.fatal) {
            ctx.uncommit()
          }

          ctx.reset(mark)
          ctx.pos = start

          return FAIL
        }
      }
    },
  }
}
