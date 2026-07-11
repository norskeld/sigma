import { sequence } from '@combinators'
import { regexp, string, whitespace } from '@parsers'
import { describe, it, result, run, should } from '@testing'

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

  it('should match every character that \\s matches', () => {
    const chars = '\t\n\v\f\r   ' + '           ' + '    　﻿'

    should.beEqual(/^\s+$/.test(chars), true)

    const actual = run(whitespace(), chars)

    should.beStrictEqual(actual, {
      isOk: true,
      start: 0,
      end: chars.length,
      pos: chars.length,
      value: chars,
    })
  })

  it('should not match non-whitespace Unicode characters', () => {
    for (const char of ['​', '᠎', 'あ', 'x']) {
      should.beEqual(/^\s/.test(char), false)
      should.matchState(run(whitespace(), char), result(false, 'whitespace'))
    }
  })

  it('should stop at the first non-whitespace character', () => {
    const actual = run(whitespace(), '\t\r\n x')
    const expected = result(true, '\t\r\n ')

    should.matchState(actual, expected)
  })
})
