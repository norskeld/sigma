import { whitespace } from '@lib/parsers/whitespace'
import { sequence } from '@lib/combinators/sequence'
import { string } from '@lib/parsers/string'
import { regexp } from '@lib/parsers/regexp'

import { run, result, should } from '@tests/@helpers'

describe(whitespace, () => {
  it('should succeed if given a string of spaces', () => {
    const space = ' '

    const actual = run(whitespace(), space.repeat(4))
    const expected = result('success', space.repeat(4))

    should.matchState(actual, expected)
  })

  it('should succeed if given a string starting with spaces', () => {
    const space = ' '

    const actual = run(whitespace(), space.repeat(4) + 'const')
    const expected = result('success', space.repeat(4))

    should.matchState(actual, expected)
  })

  it('should succeed if given a mixed string with spaces', () => {
    const identifier = regexp(/\w+/g, 'identifier')
    const keyword = string('let')
    const ws = whitespace()

    const actual = run(sequence(keyword, ws, identifier), 'let identity')
    const expected = result('success', ['let', ' ', 'identity'])

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const actual = run(sequence(string('let'), whitespace(), string('rec')), 'letrec')
    const expected = result('failure', 'whitespace')

    should.matchState(actual, expected)
  })
})
