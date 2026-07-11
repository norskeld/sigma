import type { Parser } from '@types'

/**
 * Parses any single character (a full code point) from the input and returns it. Fails at the end
 * of input.
 *
 * @returns A single parsed character.
 */
export function any(): Parser<string> {
  return {
    parse(input, pos) {
      if (input.length === pos) {
        return {
          isOk: false,
          start: pos,
          end: pos,
          pos,
          expected: 'any @ reached the end of input',
        }
      }

      // Read a full code point to avoid splitting surrogate pairs.
      const value = String.fromCodePoint(input.codePointAt(pos) as number)
      const nextPos = pos + value.length

      return {
        isOk: true,
        start: pos,
        end: nextPos,
        pos: nextPos,
        value,
      }
    },
  }
}
