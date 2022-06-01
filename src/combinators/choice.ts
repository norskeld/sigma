import { type Parser } from '../state'
import { type ToUnion } from '../utils/types'

export function choice<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToUnion<T>>
export function choice<T>(...ps: Array<Parser<T>>): Parser<T> {
  return {
    parse(input, pos) {
      // It's "guaranteed" by type system that there will be at least two parsers, so I'm not gonna
      // bother checking for `ps` length and asserting it, because it would hit performance.
      const [first, ...rest] = ps

      // Run the first parser to infer the type.
      let nextResult = first.parse(input, pos)

      // Test other alternatives if the first one fails.
      if (!nextResult.isOk) {
        for (const parser of rest) {
          const result = parser.parse(input, pos)

          switch (result.isOk) {
            case true: {
              return result
            }

            case false: {
              if (!nextResult || nextResult.pos < result.pos) {
                nextResult = result
              }
            }
          }
        }
      }

      return nextResult
    }
  }
}
