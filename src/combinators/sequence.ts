import { type Parser } from '../state'
import { type ToTuple } from '../utils/types'

/**
 * Applies `ps` parsers in order, until *all* of them succeed.
 *
 * @param ps - Parsers to apply
 *
 * @returns Tuple of values returned by `ps` parsers
 */
export function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTuple<T>>
export function sequence<T>(...ps: Array<Parser<T>>): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const values: Array<T> = []
      let nextPos = pos

      for (const parser of ps) {
        const result = parser.parse(input, nextPos)

        switch (result.isOk) {
          case true: {
            values.push(result.value)
            nextPos = result.pos
            break
          }

          case false: {
            return result
          }
        }
      }

      return {
        isOk: true,
        pos: nextPos,
        value: values
      }
    }
  }
}
