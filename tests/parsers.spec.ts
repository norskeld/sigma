import * as exposed from '@lib/parsers'

import { should } from '@tests/@helpers'

it('should expose parsers', () => {
  should.expose(
    exposed,
    'defer',
    'eof',
    'eol',
    'float',
    'int',
    'uint',
    'letter',
    'letters',
    'nothing',
    'regexp',
    'rest',
    'run',
    'string',
    'ustring',
    'whitespace'
  )
})
