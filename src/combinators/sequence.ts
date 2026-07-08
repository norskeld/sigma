import type { Parser, ToTuple, ToTupleOrArray } from '@types'

/**
 * Applies `ps` parsers in order, until *all* of them succeed.
 *
 * @param ps - Parsers to apply
 *
 * @returns Tuple of values returned by `ps` parsers
 */
export function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTuple<T>>
export function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTupleOrArray<T>>
export function sequence<T>(...ps: Array<Parser<T>>): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const values = new Array<T>(ps.length)
      let nextPos = pos

      for (let index = 0; index < ps.length; index++) {
        const result = ps[index].parse(input, nextPos)

        switch (result.isOk) {
          case true: {
            values[index] = result.value
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
        span: [pos, nextPos],
        pos: nextPos,
        value: values
      }
    }
  }
}
