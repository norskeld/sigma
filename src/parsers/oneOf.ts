import { type Parser } from '../state'

export function oneOf(chars: string): Parser<string> {
  const charset = [...chars]

  return {
    parse(input, pos) {
      const nextPos = pos + 1
      const char = input.substring(pos, nextPos)

      if (charset.includes(char)) {
        return {
          isOk: true,
          pos: nextPos,
          value: char
        }
      }

      return {
        isOk: false,
        pos,
        expected: `one of: ${charset.join(', ')}`
      }
    }
  }
}
