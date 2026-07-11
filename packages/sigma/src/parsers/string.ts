import type { Parser } from '@types'

/**
 * Parses a string.
 *
 * @param match - String to parse
 *
 * @returns Parsed string
 */
export function string(match: string): Parser<string> {
  if (match.length === 1) {
    const code = match.charCodeAt(0)

    return {
      parse(input, pos) {
        // Out of range charCodeAt yields NaN, which never compares equal.
        if (input.charCodeAt(pos) === code) {
          const nextPos = pos + 1

          return {
            isOk: true,
            start: pos,
            end: nextPos,
            pos: nextPos,
            value: match,
          }
        }

        return {
          isOk: false,
          start: pos,
          end: Math.min(pos + 1, input.length),
          pos,
          expected: match,
        }
      },
    }
  }

  return {
    parse(input, pos) {
      if (input.startsWith(match, pos)) {
        const nextPos = pos + match.length

        return {
          isOk: true,
          start: pos,
          end: nextPos,
          pos: nextPos,
          value: match,
        }
      }

      return {
        isOk: false,
        start: pos,
        end: Math.min(pos + match.length, input.length),
        pos,
        expected: match,
      }
    },
  }
}
