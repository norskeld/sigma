import { sequence } from '@lib/combinators/sequence'
import { string } from '@lib/parsers/string'

import { run, result, should } from '@tests/@helpers'

describe(sequence, () => {
  it('should succeed if a sequence of parsers succeeds', () => {
    const parser = sequence(string('hello'), string(' '), string('world'))
    const actual = run(parser, 'hello world')
    const expected = result('success', ['hello', ' ', 'world'])

    should.matchState(actual, expected)
  })

  it('should fail if a sequence of parsers fails somewhere', () => {
    const parser = sequence(string('hello'), string(' '), string('world'))
    const actual = run(parser, 'bye friend')
    const expected = result('failure', 'hello')

    should.matchState(actual, expected)
  })
})
