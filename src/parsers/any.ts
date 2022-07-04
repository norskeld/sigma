import { type Parser } from '../state'

export function any(): Parser<string> {
  return {
    parse(input, pos) {
      if (input.length === pos) {
        return {
          isOk: false,
          pos,
          expected: 'reached the end of input'
        }
      }

      const nextPos = pos + 1
      const value = input.substring(pos, nextPos)

      return {
        isOk: true,
        pos: nextPos,
        value
      }
    }
  }
}
