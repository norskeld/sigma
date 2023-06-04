import { many } from './many'
import { sequence } from './sequence'

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

      // If the parser succeeds, run the parser and separator parser many times.
      if (resultP.isOk) {
        const resultS = many(sequence(sep, parser)).parse(input, resultP.pos)
        const values = [resultP.value]

        // If the parsers succeed, concatenate the values sans the separator.
        for (const [, value] of resultS.value) {
          values.push(value)
        }

        return {
          isOk: true,
          span: [pos, resultS.pos],
          pos: resultS.pos,
          value: values
        }
      }

      return {
        isOk: true,
        span: [pos, pos],
        pos,
        value: []
      }
    }
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

      // If the parser succeeds, run the parser and separator parser many times.
      if (resultP.isOk) {
        const resultS = many(sequence(sep, parser)).parse(input, resultP.pos)
        const values = [resultP.value]

        // If the parsers succeed, concatenate the values sans the separator.
        for (const [, value] of resultS.value) {
          values.push(value)
        }

        return {
          isOk: true,
          span: [pos, resultS.pos],
          pos: resultS.pos,
          value: values
        }
      }

      return {
        isOk: false,
        span: [pos, resultP.pos],
        pos: resultP.pos,
        expected: resultP.expected
      }
    }
  }
}
