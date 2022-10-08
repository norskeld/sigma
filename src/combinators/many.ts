import type { Parser, SafeParser } from '@types'

/**
 * Applies `parser` *zero* or more times, collecting its results. Never fails.
 *
 * @param parser - Parser to apply
 *
 * @returns Array of the returned values of `parser`
 */
export function many<T>(parser: Parser<T>): SafeParser<Array<T>> {
  return {
    parse(input, pos) {
      const values: Array<T> = []
      let nextPos = pos

      while (true) {
        const result = parser.parse(input, nextPos)

        switch (result.isOk) {
          case true: {
            values.push(result.value)
            nextPos = result.pos
            break
          }

          case false: {
            return {
              isOk: true,
              pos: nextPos,
              value: values
            }
          }
        }
      }
    }
  }
}

/**
 * Applies `parser` *one* or more times, collecting its results.
 *
 * @param parser - Parser to apply
 *
 * @returns Array of the returned values of `parser`
 */
export function many1<T>(parser: Parser<T>): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const resultP = parser.parse(input, pos)

      if (resultP.isOk) {
        const values: Array<T> = []
        let nextPos = resultP.pos

        values.push(resultP.value)

        while (true) {
          const resultR = parser.parse(input, nextPos)

          if (resultR.isOk) {
            values.push(resultR.value)
            nextPos = resultR.pos
            continue
          }

          return {
            isOk: true,
            pos: nextPos,
            value: values
          }
        }
      }

      return resultP
    }
  }
}
