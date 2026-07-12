import type { Parser, ToParser } from '@types'
import { FAIL } from '@types'

/**
 * Context provided to a callback for producing conditional/chained parser.
 *
 * @internal
 */
interface Context<T> {
  value: T
  input: string
  pos: number
}

/**
 * Creates chained, context-aware `parser`, that may depend on the output of the `context` parser.
 *
 * @param context - Source (context) parser
 * @param parser - Function that returns a new parser
 *
 * @returns New parser
 */
export function when<T, R extends Parser<unknown>>(
  context: Parser<T>,
  parser: (ctx: Context<T>) => R,
): ToParser<R> {
  return {
    parse(ctx) {
      const start = ctx.pos

      const result = context.parse(ctx)
      if (result === FAIL) return FAIL

      const next = parser({ value: result as T, pos: ctx.pos, input: ctx.input }).parse(ctx)

      if (next === FAIL) {
        ctx.pos = start
        return FAIL
      }

      return next
    },
  } as ToParser<R>
}
