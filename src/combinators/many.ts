import type { Parser, SafeParser } from '../state'

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

export function many1<T>(parser: Parser<T>): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const result = many(parser).parse(input, pos)

      switch (result.value.length > 0) {
        case true: {
          return result
        }

        case false: {
          return {
            isOk: false,
            pos: result.pos,
            expected: 'at least one successful application of the parser'
          }
        }
      }
    }
  }
}
