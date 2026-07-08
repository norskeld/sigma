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

  return {
    parse(input, pos) {
      if (input.length === pos) {
        return {
          isOk: false,
          span: [pos, pos],
          pos,
          expected: 'oneOf @ reached the end of input'
        }
      }

      // Read a full code point to avoid splitting surrogate pairs.
      const char = String.fromCodePoint(input.codePointAt(pos) as number)
      const nextPos = pos + char.length

      if (charset.includes(char)) {
        return {
          isOk: true,
          span: [pos, nextPos],
          pos: nextPos,
          value: char
        }
      }

      return {
        isOk: false,
        span: [pos, pos],
        pos,
        expected: `one of: ${charset.join(', ')}`
      }
    }
  }
}
