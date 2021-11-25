import * as exposed from '@lib/parsers'

import { should } from '@tests/@helpers'

it('should expose parsers', () => {
  should.expose(
    exposed,
    'defer',
    'float',
    'integer',
    'int',
    'lazy',
    'nothing',
    'nil',
    'regexp',
    're',
    'rest',
    'string',
    'str',
    'uniString',
    'ustr',
    'whitespace',
    'ws',
    'whitespaceOptional',
    'wsOpt'
  )
})
