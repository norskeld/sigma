import { char } from '@parsers'
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
})
