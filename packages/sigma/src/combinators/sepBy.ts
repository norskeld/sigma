import type { Parser } from '@types'

/**
 * Parses *zero* or more occurrences of `parser`, separated by `sep`. Never fails.
 *
 * @param parser - Parser to apply
 * @param sep - Separating parser
 *
 * @returns List of values (without separator) returned by `parser`
 */
export function sepBy<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>> {
  return {
    parse(input, pos) {
      // Run the parser once to get the first value.
      const resultP = parser.parse(input, pos)

      // If the parser succeeds, run the separator and parser pairwise many times.
      if (resultP.isOk) {
        const values = [resultP.value]
        let nextPos = resultP.pos

        while (nextPos < input.length) {
          const resultS = sep.parse(input, nextPos)
          if (!resultS.isOk) break

          // The progress guard covers the whole sep-value pair to discard zero-width matches.
          const resultV = parser.parse(input, resultS.pos)
          if (!resultV.isOk || resultV.pos <= nextPos) break

          values.push(resultV.value)
          nextPos = resultV.pos
        }

        return {
          isOk: true,
          span: [pos, nextPos],
          pos: nextPos,
          value: values,
        }
      }

      return {
        isOk: true,
        span: [pos, pos],
        pos,
        value: [],
      }
    },
  }
}

/**
 * Parses *one* or more occurrences of `parser`, separated by `sep`.
 *
 * @param parser - Parser to apply
 * @param sep - Separating parser
 *
 * @returns List of values (without separator) returned by `parser`
 */
export function sepBy1<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>> {
  return {
    parse(input, pos) {
      // Run the parser once to get the first value.
      const resultP = parser.parse(input, pos)

      // If the parser succeeds, run the separator and parser pairwise many times.
      if (resultP.isOk) {
        const values = [resultP.value]
        let nextPos = resultP.pos

        while (nextPos < input.length) {
          const resultS = sep.parse(input, nextPos)

          if (!resultS.isOk) {
            break
          }

          const resultV = parser.parse(input, resultS.pos)

          // The progress guard covers the whole sep-value pair to discard zero-width matches.
          if (!resultV.isOk || resultV.pos <= nextPos) {
            break
          }

          values.push(resultV.value)
          nextPos = resultV.pos
        }

        return {
          isOk: true,
          span: [pos, nextPos],
          pos: nextPos,
          value: values,
        }
      }

      return resultP
    },
  }
}
