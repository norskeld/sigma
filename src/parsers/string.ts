import { type Parser } from '../state'

import { size } from '../utils/unicode'

export function string(match: string): Parser<string> {
  return {
    parse(input, pos) {
      const nextPos = pos + match.length
      const slice = input.substring(pos, nextPos)

      switch (slice === match) {
        case true: {
          return {
            isOk: true,
            pos: nextPos,
            value: match
          }
        }

        case false: {
          return {
            isOk: false,
            pos: nextPos,
            expected: match
          }
        }
      }
    }
  }
}

export function ustring(match: string): Parser<string> {
  return {
    parse(input, pos) {
      const nextPos = pos + size(match)
      const slice = input.substring(pos, nextPos)

      switch (slice === match) {
        case true: {
          return {
            isOk: true,
            pos: nextPos,
            value: match
          }
        }

        case false: {
          return {
            isOk: false,
            pos: nextPos,
            expected: match
          }
        }
      }
    }
  }
}
