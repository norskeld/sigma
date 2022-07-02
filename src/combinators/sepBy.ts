import { type Parser } from '../state'

import { many } from './many'
import { sequence } from './sequence'

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
        resultS.value.forEach(([, value]) => values.push(value))

        return {
          isOk: true,
          pos: resultS.pos,
          value: values
        }
      }

      return {
        isOk: true,
        pos: resultP.pos,
        value: []
      }
    }
  }
}

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
        resultS.value.forEach(([, value]) => values.push(value))

        return {
          isOk: true,
          pos: resultS.pos,
          value: values
        }
      }

      return {
        isOk: false,
        pos: resultP.pos,
        expected: resultP.expected
      }
    }
  }
}
