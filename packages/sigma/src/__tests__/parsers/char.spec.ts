import { sequence } from '@combinators'
import { char, rest } from '@parsers'
import { describe, it, parseAt, result, run, should } from '@testing'

describe('char', () => {
  it('should succeed and consume one character on a match', () => {
    const actual = parseAt(char('a'), 'abc', 0)
    should.beStrictEqual(actual, { isOk: true, start: 0, end: 1, pos: 1, value: 'a' })
  })

  it('should fail without consuming input on a mismatch', () => {
    should.matchState(run(char('a'), 'b'), result(false, 'a'))
  })

  it('should fail on empty input', () => {
    should.matchState(run(char('a'), ''), result(false, 'a'))
  })

  it('should succeed and consume a full surrogate pair on a match', () => {
    const actual = parseAt(char('\u{1F600}'), '\u{1F600}!', 0)
    should.beStrictEqual(actual, { isOk: true, start: 0, end: 2, pos: 2, value: '\u{1F600}' })
  })

  it('should leave the position after the surrogate pair for the next parser', () => {
    const actual = run(sequence(char('\u{1F600}'), rest()), '\u{1F600}!')
    should.matchState(actual, result(true, ['\u{1F600}', '!']))
  })

  it('should fail without consuming input on a surrogate pair mismatch', () => {
    should.matchState(run(char('\u{1F600}'), '\u{1F601}'), result(false, '\u{1F600}'))
  })
})
