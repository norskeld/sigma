import { type Parser } from '../state'

export function map<T, R>(parser: Parser<T>, fn: (value: T) => R): Parser<R> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            pos: result.pos,
            value: fn(result.value)
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}

export function mapTo<T, R>(parser: Parser<T>, value: R): Parser<R> {
  return map(parser, () => value)
}
