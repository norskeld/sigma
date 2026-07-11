import type { Parser } from '@types'

/**
 * Parses a string that matches a provided `re` regular expression. Returns the matched string, or
 * fails with an `expected` message.
 *
 * The regular expression must obey one simple rule: *doesn't* use `^` and `$` to match at the
 * beginning or at the end of the text.
 *
 * Matching is performed in sticky mode, so `g` and `y` flags are handled automatically. Flags like
 * `u` and `i` are allowed and can be added if needed.
 *
 * @param rs - Regular expression
 * @param expected - Error message if the regular expression does not match input
 *
 * @returns Matched string
 */
export function regexp(rs: RegExp, expected: string): Parser<string> {
  // Sticky matching only ever attempts the match at `lastIndex`, unlike the global flag, which
  // scans the rest of the input on failure.
  const re = rs.sticky ? rs : new RegExp(rs.source, rs.flags.replace('g', '') + 'y')

  return {
    parse(input, pos) {
      re.lastIndex = pos

      const result = re.exec(input)

      if (result) {
        const [match] = result
        const index = pos + match.length

        return {
          isOk: true,
          span: [pos, index],
          pos: index,
          value: match,
        }
      } else {
        return {
          isOk: false,
          span: [pos, pos],
          pos,
          expected,
        }
      }
    },
  }
}
