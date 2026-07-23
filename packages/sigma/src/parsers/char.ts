import type { Parser } from '@types'

/** @internal */
export type CharConstraint<T extends string> = T extends `${infer _}${infer Rest}`
  ? Rest extends ''
    ? T
    : 'expected at most one character'
  : 'expected at least one character'

/**
 * Parses a single character (a full code point).
 *
 * @param match - Character to parse
 *
 * @returns Parsed character
 */
export function char<const T extends string>(match: CharConstraint<T>): Parser<string> {
  const code = match.charCodeAt(0)

  if (match.length === 1) {
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

  const low = match.charCodeAt(1)

  return {
    parse(ctx) {
      const pos = ctx.pos

      if (ctx.input.charCodeAt(pos) === code && ctx.input.charCodeAt(pos + 1) === low) {
        ctx.pos = pos + 2
        return match
      }

      return ctx.fail(match, Math.min(pos + 2, ctx.input.length))
    },
  }
}
