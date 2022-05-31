import { type Parser } from '../state'

import { regexp } from './regexp'

const FLOAT_RE = /-?\d+\.\d+/g

export function float(): Parser<number> {
  return {
    parse(input, pos) {
      const result = regexp(FLOAT_RE, 'float').parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            pos: result.pos,
            value: parseFloat(result.value)
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}
