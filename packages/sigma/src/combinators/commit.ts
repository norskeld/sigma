import type { Parser } from '@types'
import { FAIL } from '@types'

/**
 * Applies `parser` and behaves exactly like it on success. On failure the failure becomes committed
 * and stops being backtracked over, until `recover` or `backtrack` clears it. Nested commits keep
 * the innermost label, falling back to the nearest enclosing one when the inner commit has none.
 *
 * @param parser - Parser to apply
 * @param label - Label reported on the failure
 *
 * @returns Result of `parser`, with failures committed
 */
export function commit<T>(parser: Parser<T>, label?: string): Parser<T> {
  const tag = label ?? null

  return {
    parse(ctx) {
      const result = parser.parse(ctx)

      if (result === FAIL) {
        if (!ctx.fatal) {
          return ctx.commit(tag)
        }

        if (ctx.label === null) {
          ctx.label = tag
        }
      }

      return result
    },
  }
}

/**
 * Applies `parser` and turns a committed failure back into an ordinary one, so enclosing
 * combinators may backtrack over it again. The label set by `commit` is cleared along with it.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser`, with failures uncommitted
 */
export function backtrack<T>(parser: Parser<T>): Parser<T> {
  return {
    parse(ctx) {
      const result = parser.parse(ctx)

      if (result === FAIL && ctx.fatal) {
        ctx.uncommit()
      }

      return result
    },
  }
}
