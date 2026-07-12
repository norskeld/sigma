import type { Parser } from '@types'

/**
 * Ensures that one of the characters in the given string matches the current character.
 *
 * @param chars - A string of characters that current character should match
 *
 * @returns Current character
 */
export function oneOf(chars: string): Parser<string> {
  const charset = [...chars]
  const codepoints = new Set(charset.map((char) => char.codePointAt(0) as number))
  const expected = `one of: ${charset.join(', ')}`

  return {
    parse(ctx) {
      if (ctx.input.length === ctx.pos) {
        return ctx.fail('oneOf @ reached the end of input')
      }

      // Read a full code point to avoid splitting surrogate pairs.
      const code = ctx.input.codePointAt(ctx.pos) as number

      if (codepoints.has(code)) {
        const char = String.fromCodePoint(code)
        ctx.pos += char.length
        return char
      }

      return ctx.fail(expected)
    },
  }
}
