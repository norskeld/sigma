import * as exposed from '@lib/parsers'

import { should } from '@tests/@helpers'

export const expectedParsers = [
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
] as const

it('should expose parsers', () => {
  should.expose(exposed, ...expectedParsers)
})
