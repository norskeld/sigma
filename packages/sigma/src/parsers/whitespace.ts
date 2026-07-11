import type { Parser } from '@types'

/**
 * Parses whitespace, either a single character or consecutive ones. Matches the same character set
 * as `\s` in regular expressions.
 *
 * @returns Matched whitespace character(s)
 */
export function whitespace(): Parser<string> {
  return {
    parse(input, pos) {
      let next = pos

      while (next < input.length) {
        const code = input.charCodeAt(next)

        // Fast path for ASCII whitespace
        if (code === 0x20 || (code >= 0x09 && code <= 0x0d)) {
          next++
          continue
        }

        // Fast exit for standard non-whitespace ASCII characters
        if (code < 0x80) break

        // Non-ASCII Unicode whitespace
        if (
          code === 0xa0 ||
          code === 0x1680 ||
          (code >= 0x2000 && code <= 0x200a) ||
          code === 0x2028 ||
          code === 0x2029 ||
          code === 0x202f ||
          code === 0x205f ||
          code === 0x3000 ||
          code === 0xfeff
        ) {
          next++
          continue
        }

        break
      }

      if (next > pos) {
        // 2. String Allocation Optimization: Return static string for single spaces
        const value =
          next - pos === 1 && input.charCodeAt(pos) === 0x20 ? ' ' : input.slice(pos, next)

        return {
          isOk: true,
          start: pos,
          end: next,
          pos: next,
          value,
        }
      }

      // Note: Allocating a failure object is unavoidable here unless
      // your @types allow for a static failure token or mutating a shared state.
      return {
        isOk: false,
        start: pos,
        end: pos,
        pos,
        expected: 'whitespace',
      }
    },
  }
}
