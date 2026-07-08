import type { Parser, Span } from '@types'

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
      const nextPos = Math.min(pos + match.length, input.length)
      const slice = input.substring(pos, nextPos)
      const span: Span = [pos, nextPos]

      switch (slice === match) {
        case true: {
          return {
            isOk: true,
            span,
            pos: nextPos,
            value: match
          }
        }

        case false: {
          return {
            isOk: false,
            span,
            pos,
            expected: match
          }
        }
      }
    }
  }
}
