import type { Parser } from '../types'

/**
 * Parses a single character.
 *
 * @param match - Character to parse
 *
 * @returns Parsed character
 */
export function char(match: string): Parser<string> {
  const code = match.charCodeAt(0)

  return {
    parse(ctx) {
      const pos = ctx.pos

      // Out of range charCodeAt yields NaN, which never compares equal.
      if (ctx.input.charCodeAt(pos) === code) {
        ctx.pos = pos + 1
        return match
      }

      return ctx.fail(match, Math.min(pos + 1, ctx.input.length))
    },
  }
}
