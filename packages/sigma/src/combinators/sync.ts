import type { Parser, SucceedingParser } from '@types'
import { FAIL } from '@types'

/** Width of the code point at `pos`, so scanning never splits a surrogate pair. @internal */
function width(input: string, pos: number): number {
  return (input.codePointAt(pos) as number) > 0xffff ? 2 : 1
}

/**
 * Consumes input until `sync` matches, stopping *before* it, or at the end of input if it never
 * matches. A match at the starting position counts, so nothing is consumed when the cursor already
 * sits on the resynchronisation point. Never fails.
 *
 * @param sync - Parser marking the resynchronisation point
 *
 * @returns `null`
 */
export function syncTo(sync: Parser<unknown>): SucceedingParser<null> {
  return {
    parse(ctx) {
      const input = ctx.input
      const length = input.length
      const mark = ctx.mark()

      while (ctx.pos < length) {
        const at = ctx.pos
        const result = sync.parse(ctx)

        if (result !== FAIL) {
          ctx.pos = at
          ctx.reset(mark)

          return null
        }

        // The scan is speculative, so the sync parser's own commitments do not count.
        if (ctx.fatal) {
          ctx.uncommit()
        }

        ctx.reset(mark)
        ctx.pos = at + width(input, at)
      }

      return null
    },
  }
}

/**
 * Consumes input until `sync` matches, consuming the match too, or stops at the end of input if it
 * never matches. A match at the starting position counts. Advances unless the cursor is already at
 * the end of the input, so recovery inside a repetition always progresses. Never fails.
 *
 * @param sync - Parser marking the resynchronisation point
 *
 * @returns `null`
 */
export function syncPast(sync: Parser<unknown>): SucceedingParser<null> {
  return {
    parse(ctx) {
      const input = ctx.input
      const length = input.length
      const mark = ctx.mark()

      while (ctx.pos < length) {
        const at = ctx.pos
        const result = sync.parse(ctx)

        if (result !== FAIL) {
          ctx.reset(mark)

          return null
        }

        // The scan is speculative, so the sync parser's own commitments do not count.
        if (ctx.fatal) {
          ctx.uncommit()
        }

        ctx.reset(mark)
        ctx.pos = at + width(input, at)
      }

      return null
    },
  }
}

/**
 * Skips out of a region delimited by `open` and `close`, starting inside it and stopping after the
 * `close` that balances it. Nested pairs are tracked, so an inner `close` does not end the region
 * early.
 *
 * @param open - Opening delimiter
 * @param close - Closing delimiter
 *
 * @returns `null` if the region closes
 */
export function syncNested(open: Parser<unknown>, close: Parser<unknown>): Parser<null> {
  return {
    parse(ctx) {
      const input = ctx.input
      const length = input.length
      const mark = ctx.mark()
      const start = ctx.pos

      // The cursor starts inside the region, so the enclosing `open` is already consumed.
      let depth = 1

      while (ctx.pos < length) {
        const at = ctx.pos

        // Zero-width delimiter matches are ignored, otherwise the scan would never terminate.
        if (close.parse(ctx) !== FAIL && ctx.pos > at) {
          ctx.reset(mark)

          if (--depth === 0) {
            return null
          }

          continue
        }

        // The scan is speculative, so the delimiters' own commitments do not count.
        if (ctx.fatal) {
          ctx.uncommit()
        }

        ctx.reset(mark)
        ctx.pos = at

        if (open.parse(ctx) !== FAIL && ctx.pos > at) {
          ctx.reset(mark)
          depth++
          continue
        }

        if (ctx.fatal) {
          ctx.uncommit()
        }

        ctx.reset(mark)
        ctx.pos = at + width(input, at)
      }

      ctx.pos = start

      return ctx.fail('nested region')
    },
  }
}
