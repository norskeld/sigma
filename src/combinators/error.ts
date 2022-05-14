import { type Parser } from '../state'

export function error<T>(parser: Parser<T>, expected: string): Parser<T> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          return result
        }

        case false: {
          return {
            isOk: false,
            pos,
            expected
          }
        }
      }
    }
  }
}
