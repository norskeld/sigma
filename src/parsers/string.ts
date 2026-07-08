import type { Parser } from '@types'

/**
 * Parses a string.
 *
 * @param match - String to parse
 *
 * @returns Parsed string
 */
export function string(match: string): Parser<string> {
  return {
    parse(input, pos) {
      if (input.startsWith(match, pos)) {
        const nextPos = pos + match.length

        return {
          isOk: true,
          span: [pos, nextPos],
          pos: nextPos,
          value: match
        }
      }

      return {
        isOk: false,
        span: [pos, Math.min(pos + match.length, input.length)],
        pos,
        expected: match
      }
    }
  }
}
