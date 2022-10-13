import type { Parser, ToParser } from '@types'

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
  parser: (ctx: Context<T>) => R
): ToParser<R> {
  return {
    parse(input, pos) {
      const result = context.parse(input, pos)

      switch (result.isOk) {
        case true: {
          return parser({ value: result.value, pos: result.pos, input }).parse(input, result.pos)
        }

        case false: {
          return result
        }
      }
    }
  } as ToParser<R>
}
