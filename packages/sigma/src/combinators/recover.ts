import type { Failure, Parser, Span } from '@types'
import { FAIL } from '@types'

/** Options narrowing which committed failures a `recover` handles. */
export interface RecoverOptions {
  /** Only handle failures committed with this exact label. */
  readonly label?: string
}

/** @internal */
type Fallback<R> = (failure: Failure, span: Span) => R

/**
 * Applies `parser` and, if it fails *while committed*, resynchronises with `strategy` and resolves
 * to `fallback`'s value instead, recording the failure on the result's `errors`. `strategy` runs
 * from the position the failure was reported at, while `fallback`'s span covers the whole region.
 *
 * Uncommitted failures pass through untouched. If `strategy` itself fails, the original failure is
 * re-raised, still committed.
 *
 * @param parser - Parser to apply
 * @param strategy - Parser that consumes the malformed region
 * @param fallback - Builds the value standing in for the malformed region
 * @param options - Restricts which committed failures are handled
 *
 * @returns Value of `parser`, or `fallback`'s value if it failed while committed
 */
export function recover<T>(parser: Parser<T>, strategy: Parser<unknown>): Parser<T | null>
export function recover<T, R>(
  parser: Parser<T>,
  strategy: Parser<unknown>,
  fallback: Fallback<R>,
  options?: RecoverOptions,
): Parser<T | R>
export function recover<T, R>(
  parser: Parser<T>,
  strategy: Parser<unknown>,
  fallback?: Fallback<R>,
  options?: RecoverOptions,
): Parser<T | R | null> {
  const label = options?.label

  return {
    parse(ctx) {
      const start = ctx.pos
      const mark = ctx.mark()
      const result = parser.parse(ctx)

      if (result !== FAIL || !ctx.fatal) {
        return result as T
      }

      // Decline failures meant for a different recovery point, leaving them committed.
      if (label !== undefined && ctx.label !== label) {
        return FAIL
      }

      const failure = ctx.snapshot()
      const inner = ctx.mark()

      ctx.uncommit()

      // Scanning from where the parse got stuck keeps the accepted prefix from ending the region.
      ctx.pos = failure.pos

      const skipped = strategy.parse(ctx)

      // With no resynchronisation point the failure stands, as does what was recovered inside it.
      if (skipped === FAIL) {
        ctx.pos = start
        ctx.reset(inner)
        ctx.uncommit()
        ctx.restore(failure)

        return ctx.commit(failure.label)
      }

      // The region was replaced wholesale, so diagnostics from the rejected attempt go with it.
      ctx.reset(mark)
      ctx.record(failure)

      return fallback === undefined
        ? null
        : fallback(failure, {
            start,
            end: ctx.pos,
          })
    },
  }
}
