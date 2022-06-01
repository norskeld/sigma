import { type Parser } from '../state'
import { type ToParser } from '../utils/types'

interface Context<T> {
  value: T
  input: string
  pos: number
}

export function when<T, R extends Parser<unknown>>(
  context: Parser<T>,
  parser: (ctx: Context<T>) => R
): ToParser<R> {
  return {
    parse(input: string, pos: number) {
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
