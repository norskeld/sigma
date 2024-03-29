import { sequence } from '@combinators'
import { regexp, string, whitespace } from '@parsers'
import { describe, run, result, should, it } from '@testing'

describe('whitespace', () => {
  it('should succeed if given a string of spaces', () => {
    const space = ' '

    const actual = run(whitespace(), space.repeat(4))
    const expected = result(true, space.repeat(4))

    should.matchState(actual, expected)
  })

  it('should succeed if given a string starting with spaces', () => {
    const space = ' '

    const actual = run(whitespace(), space.repeat(4) + 'const')
    const expected = result(true, space.repeat(4))

    should.matchState(actual, expected)
  })

  it('should succeed if given a mixed string with spaces', () => {
    const identifier = regexp(/\w+/g, 'identifier')
    const keyword = string('let')
    const ws = whitespace()

    const actual = run(sequence(keyword, ws, identifier), 'let identity')
    const expected = result(true, ['let', ' ', 'identity'])

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const actual = run(sequence(string('let'), whitespace(), string('rec')), 'letrec')
    const expected = result(false, 'whitespace')

    should.matchState(actual, expected)
  })
})
