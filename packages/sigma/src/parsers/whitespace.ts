import type { Parser } from '@types'

/**
 * Parses whitespace, either a single character or consecutive ones. Matches the same character set
 * as `\s` in regular expressions.
 *
 * @returns Matched whitespace character(s)
 */
export function whitespace(): Parser<string> {
  return {
    parse(ctx) {
      const input = ctx.input
      const pos = ctx.pos
      let next = pos

      while (next < input.length) {
        const code = input.charCodeAt(next)

        // Fast path for ASCII whitespace.
        if (code === 0x20 || (code >= 0x09 && code <= 0x0d)) {
          next++
          continue
        }

        // Fast exit for standard non-whitespace ASCII characters.
        if (code < 0x80) {
          break
        }

        // Non-ASCII Unicode whitespace.
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
        ctx.pos = next
        // Return a static string for single spaces to avoid allocation.
        return next - pos === 1 && input.charCodeAt(pos) === 0x20 ? ' ' : input.slice(pos, next)
      }

      return ctx.fail('whitespace')
    },
  }
}
