import type { Parser } from '@types'

/**
 * Only succeeds at the end of the input.
 *
 * @returns `null`
 */
export function eof(): Parser<null> {
  return {
    parse(input, pos) {
      switch (pos === input.length) {
        case true: {
          return {
            isOk: true,
            span: [pos, pos],
            pos: input.length,
            value: null
          }
        }

        case false: {
          return {
            isOk: false,
            span: [pos, pos],
            pos,
            expected: 'end of input'
          }
        }
      }
    }
  }
}
