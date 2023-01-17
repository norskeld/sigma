import type { Parser } from '@types'

/**
 * Parses any single character from the input and returns it. Fails at the end of input.
 *
 * @returns A single parsed character.
 */
export function any(): Parser<string> {
  return {
    parse(input, pos) {
      if (input.length === pos) {
        return {
          isOk: false,
          span: [pos, pos],
          pos,
          expected: 'any @ reached the end of input'
        }
      }

      const nextPos = pos + 1
      const value = input.substring(pos, nextPos)

      return {
        isOk: true,
        span: [pos, nextPos],
        pos: nextPos,
        value
      }
    }
  }
}
