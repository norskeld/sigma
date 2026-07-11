import type { Parser } from '@types'

/**
 * Ensures that none of the characters in the given string matches the current character.
 *
 * @param chars - A string of characters that current character should not match
 *
 * @returns Current character
 */
export function noneOf(chars: string): Parser<string> {
  const charset = [...chars]
  const codepoints = new Set(charset.map((char) => char.codePointAt(0) as number))
  const expected = `none of: ${charset.join(', ')}`

  return {
    parse(input, pos) {
      if (input.length === pos) {
        return {
          isOk: false,
          start: pos,
          end: pos,
          pos,
          expected: 'noneOf @ reached the end of input',
        }
      }

      // Read a full code point to avoid splitting surrogate pairs.
      const code = input.codePointAt(pos) as number

      if (!codepoints.has(code)) {
        const char = String.fromCodePoint(code)
        const nextPos = pos + char.length

        return {
          isOk: true,
          start: pos,
          end: nextPos,
          pos: nextPos,
          value: char,
        }
      }

      return {
        isOk: false,
        start: pos,
        end: pos,
        pos,
        expected,
      }
    },
  }
}
