import { string } from './string'

import { choice, error } from '@combinators'
import type { Parser } from '@types'

const EOL_UNIX = '\n'
const EOL_NON_UNIX = '\r\n'

/**
 * Only succeeds at the end of the line, either `\n` or `\r\n`.
 *
 * @returns Matched line break character
 */
export function eol(): Parser<string> {
  return error(choice(string(EOL_UNIX), string(EOL_NON_UNIX)), 'end of line')
}
