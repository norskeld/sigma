import type { Parser, Span } from '@types'
import { size } from '@utils/unicode'

/**
 * Parses an *ASCII* string. For parsing Unicode strings, consider using `ustring`.
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
      const span = [pos, nextPos] as Span

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
            pos: nextPos,
            expected: match
          }
        }
      }
    }
  }
}

/**
 * Parses a Unicode string. For parsing ASCII-only strings, consider using `string`.
 *
 * @param match - String to parse
 *
 * @returns Parsed string
 */
export function ustring(match: string): Parser<string> {
  return {
    parse(input, pos) {
      const nextPos = Math.min(pos + size(match), input.length)
      const slice = input.substring(pos, nextPos)
      const span = [pos, nextPos] as Span

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
            pos: nextPos,
            expected: match
          }
        }
      }
    }
  }
}
