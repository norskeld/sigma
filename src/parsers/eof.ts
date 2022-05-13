import { type Parser } from '../state'

export function eof(): Parser<null> {
  return {
    parse(input, pos) {
      const isEof = pos === input.length

      switch (isEof) {
        case true: {
          return {
            isOk: true,
            pos: input.length,
            value: null
          }
        }

        case false: {
          return {
            isOk: false,
            pos,
            error: 'end of input'
          }
        }
      }
    }
  }
}
