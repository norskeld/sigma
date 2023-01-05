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

      while (nextPos < input.length) {
        const result = parser.parse(input, nextPos)

        if (result.isOk) {
          values.push(result.value)
          nextPos = result.pos
        } else {
          break
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

        while (nextPos < input.length) {
          const resultR = parser.parse(input, nextPos)

          if (resultR.isOk) {
            values.push(resultR.value)
            nextPos = resultR.pos
            continue
          }

          break
        }

        return {
          isOk: true,
          pos: nextPos,
          value: values
        }
      }

      return resultP
    }
  }
}
