import type { Parser } from '@types'

/**
 * Applies `parser` exactly `n` times and collects the values. Fails with the first failure of
 * `parser`. Resolves to an empty array if `n` is less than one.
 *
 * @param parser - Parser to apply
 * @param n - Number of times to apply `parser`
 *
 * @returns Array of values returned by `parser`
 */
export function count<T>(parser: Parser<T>, n: number): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const values: Array<T> = []
      let nextPos = pos

      for (let index = 0; index < n; index++) {
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
        start: pos,
        end: nextPos,
        pos: nextPos,
        value: values,
      }
    },
  }
}
