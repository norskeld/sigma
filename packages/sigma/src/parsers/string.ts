import type { Parser } from '@types'

/**
 * Parses a string.
 *
 * @param match - String to parse
 *
 * @returns Parsed string
 */
export function string(match: string): Parser<string> {
  const length = match.length

  return {
    parse(ctx) {
      const pos = ctx.pos

      if (ctx.input.startsWith(match, pos)) {
        ctx.pos = pos + length
        return match
      }

      return ctx.fail(match, Math.min(pos + length, ctx.input.length))
    },
  }
}
