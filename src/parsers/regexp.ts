import type { Parser } from '@state'

/**
 * Parses a string that matches a provided `re` regular expression. Returns the matched string, or
 * fails with an `expected` message.
 *
 * The regular expression must obey three simple rules:
 *
 * - It *does* use `g` flag. Flags like `u` and `i` are allowed and can be added if needed.
 * - It *doesn't* use `^` and `$` to match at the beginning or at the end of the text.
 * - It *doesn't* use capturing groups.
 *
 * @param re - Regular expression
 * @param expected - Error message if the regular expression does not match input
 *
 * @returns Matched string
 */
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
          expected
        }
      }
    }
  }
}
