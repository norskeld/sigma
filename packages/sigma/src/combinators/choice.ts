import type { Parser, ToUnion } from '@types'

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
    parse(input, pos) {
      // It's "guaranteed" by type system that there will be at least two parsers, so I'm not gonna
      // bother checking for `ps` length and asserting it, because it would hit performance.
      let nextResult = ps[0].parse(input, pos)

      // Test other alternatives if the first one fails.
      if (!nextResult.isOk) {
        for (let index = 1; index < ps.length; index++) {
          const result = ps[index].parse(input, pos)

          switch (result.isOk) {
            case true: {
              return result
            }

            case false: {
              if (nextResult.pos < result.pos) {
                nextResult = result
              }
            }
          }
        }
      }

      return nextResult
    },
  }
}
