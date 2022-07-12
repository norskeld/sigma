import { type Parser } from '../state'

/**
 * Only succeeds at the end of the input.
 *
 * @returns `null`
 */
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
            expected: 'end of input'
          }
        }
      }
    }
  }
}
