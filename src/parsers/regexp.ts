import { type Parser } from '../state'

export function regexp(re: RegExp, expected: string): Parser<string> {
  return {
    parse(input, pos) {
      // Reset RegExp index, because we abuse the 'g' flag.
      re.lastIndex = pos

      // `.exec` is actually a little bit faster than `.test`.
      const result = re.exec(input)

      if (result && result.index === pos) {
        const [match] = result
        const index = pos + match.length

        return {
          isOk: true,
          pos: index,
          value: match
        }
      } else {
        return {
          isOk: false,
          pos,
          error: expected
        }
      }
    }
  }
}
