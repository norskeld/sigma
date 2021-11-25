import { whitespace, whitespaceOptional } from '@lib/internal/parsers/whitespace'
import { sequence } from '@lib/internal/combinators/sequence'
import { string } from '@lib/internal/parsers/string'
import { regexp } from '@lib/internal/parsers/regexp'

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

describe(whitespaceOptional, () => {
  it('should succeed if given a mixed string with spaces', () => {
    const letKeyword = string('let')
    const identifier = regexp(/\w+/g, 'identifier')
    const wsOptional = whitespaceOptional()

    const parser = sequence(letKeyword, wsOptional, identifier)

    const actual = run(parser, 'let identity')
    const expected = result('success', ['let', ' ', 'identity'])

    should.matchState(actual, expected)
  })

  it('should succeed if given a mixed string with optional spaces', () => {
    const letKeyword = string('let')
    const equalKeyword = string('=')
    const identifier = regexp(/\w+/g, 'identifier')
    const wsOptional = whitespaceOptional()
    const wsRequired = whitespace()

    const parser = sequence(
      letKeyword,
      wsRequired,
      identifier,
      wsOptional,
      equalKeyword,
      wsOptional,
      identifier
    )

    const actual = run(parser, 'let identity=something')
    const expected = result('success', ['let', ' ', 'identity', '', '=', '', 'something'])

    should.matchState(actual, expected)
  })
})
