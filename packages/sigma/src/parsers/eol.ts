import { choice, error } from '@combinators'
import type { Parser } from '@types'

import { string } from './string'

const EOL_PARSER = error(choice(string('\n'), string('\r\n')), 'end of line')

/**
 * Only succeeds at the end of the line, either `\n` or `\r\n`.
 *
 * @returns Matched line break character
 */
export function eol(): Parser<string> {
  return EOL_PARSER
}
