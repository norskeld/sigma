import { Parser } from '../state'

import { choice } from '../combinators/choice'
import { error } from '../combinators/error'
import { string } from './string'

const EOL_UNIX = '\n'
const EOL_NON_UNIX = '\r\n'

export function newline(): Parser<string> {
  return error(choice(string(EOL_UNIX), string(EOL_NON_UNIX)), 'newline')
}

export { newline as eol }
