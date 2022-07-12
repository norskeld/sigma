import { type Parser } from '../state'

/**
 * Ensures that none of the characters in the given string matches the current character.
 *
 * @param chars - A string of characters that current character should not match
 *
 * @returns Current character
 */
export function noneOf(chars: string): Parser<string> {
  const charset = [...chars]

  return {
    parse(input, pos) {
      const nextPos = pos + 1
      const char = input.substring(pos, nextPos)

      if (!charset.includes(char)) {
        return {
          isOk: true,
          pos: nextPos,
          value: char
        }
      }

      return {
        isOk: false,
        pos,
        expected: `none of: ${charset.join(', ')}`
      }
    }
  }
}
