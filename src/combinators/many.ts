import { type Parser } from '../state'

export function many<T>(parser: Parser<T>): Parser<Array<T>> {
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
              input,
              value: values
            }
          }
        }
      }
    }
  }
}
