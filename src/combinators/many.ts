import type { Parser, SucceedingParser } from '@types'

/**
 * Applies `parser` *zero* or more times, collecting its results. Successes that consume no input
 * are not collected. Never fails.
 *
 * @param parser - Parser to apply
 *
 * @returns Array of the returned values of `parser`
 */
export function many<T>(parser: Parser<T>): SucceedingParser<Array<T>> {
  return {
    parse(input, pos) {
      const values: Array<T> = []
      let nextPos = pos

      while (nextPos < input.length) {
        const result = parser.parse(input, nextPos)

        // Zero-width successes are not collected, otherwise the loop would never terminate.
        if (result.isOk && result.pos > nextPos) {
          values.push(result.value)
          nextPos = result.pos
        } else {
          break
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

/**
 * Applies `parser` *one* or more times, collecting its results. After the first match, successes
 * that consume no input are not collected.
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

          // Zero-width successes are not collected, otherwise the loop would never terminate.
          if (resultR.isOk && resultR.pos > nextPos) {
            values.push(resultR.value)
            nextPos = resultR.pos
            continue
          }

          break
        }

        return {
          isOk: true,
          span: [pos, nextPos],
          pos: nextPos,
          value: values
        }
      }

      return resultP
    }
  }
}
