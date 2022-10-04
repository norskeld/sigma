import type { Parser } from '../state'
import { size } from '../utils/unicode'

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
