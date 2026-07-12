import type { Parser } from '@types'

/**
 * Parses any single character (a full code point) from the input and returns it. Fails at the end
 * of input.
 *
 * @returns A single parsed character.
 */
export function any(): Parser<string> {
  return {
    parse(ctx) {
      if (ctx.input.length === ctx.pos) {
        return ctx.fail('any @ reached the end of input')
      }

      // Read a full code point to avoid splitting surrogate pairs.
      const value = String.fromCodePoint(ctx.input.codePointAt(ctx.pos) as number)
      ctx.pos += value.length

      return value
    },
  }
}
