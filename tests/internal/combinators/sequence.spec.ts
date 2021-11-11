import * as exposed from '@lib/combinators'
import { sequence, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/sequence', () => {
  it(`should expose 'sequence' ('seq')`, () => {
    should.expose(exposed, 'sequence', 'seq')
  })

  describe(sequence, () => {
    it(`should succeed if a sequence of parsers succeeds`, () => {
      const parser = sequence(string('hello'), string(' '), string('world'))
      const actual = run(parser, 'hello world')
      const expected = result('success', ['hello', ' ', 'world'])

      should.matchState(actual, expected)
    })

    it(`should fail if a sequence of parsers fails somewhere`, () => {
      const parser = sequence(string('hello'), string(' '), string('world'))
      const actual = run(parser, 'bye friend')
      const expected = result('failure', 'hello')

      should.matchState(actual, expected)
    })
  })
})
