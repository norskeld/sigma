import type { Parser } from '@types'

/**
 * Parses a string that matches a provided `re` regular expression. Returns the matched string, or
 * fails with an `expected` message.
 *
 * The regular expression must obey two simple rules:
 *
 * - It *does* use `g` flag. Flags like u and i are allowed and can be added if needed.
 * - It *doesn't* use `^` and `$` to match at the beginning or at the end of the text.
 *
 * If `g` flag is missing, it will be automatically injected. It's still better to always provide it
 * to avoid small performance penalty and clearly document the intention.
 *
 * @param rs - Regular expression
 * @param expected - Error message if the regular expression does not match input
 *
 * @returns Matched string
 */
export function regexp(rs: RegExp, expected: string): Parser<string> {
  const re = rs.global ? rs : new RegExp(rs.source, rs.flags + 'g')

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
          span: [pos, index],
          pos: index,
          value: match
        }
      } else {
        return {
          isOk: false,
          // TODO: Can this be improved? Zero-length span for this parser doesn't look helpful.
          span: [pos, pos],
          pos,
          expected
        }
      }
    }
  }
}
