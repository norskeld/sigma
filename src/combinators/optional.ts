import type { Parser } from '@types'

/**
 * Applies `parser`, falling back to `null` if it fails. Never fails.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser` or `null`
 */
export function optional<T>(parser: Parser<T>): Parser<T | null> {
  return {
    parse(input, pos) {
      const result = parser.parse(input, pos)

      switch (result.isOk) {
        case true: {
          return result
        }

        case false: {
          return {
            isOk: true,
            span: [pos, pos],
            pos,
            value: null
          }
        }
      }
    }
  }
}
