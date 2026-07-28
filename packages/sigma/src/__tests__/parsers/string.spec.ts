import { many } from '@combinators'
import { string } from '@parsers'
import { describe, it, parseAt, result, run, should } from '@testing'

describe('string', () => {
  it('should succeed if given an ASCII string', () => {
    const tCase = 'test'

    const actual = run(string(tCase), tCase)
    const expected = result(true, tCase)

    should.matchState(actual, expected)
  })

  it('should succeed if given a Unicode string', () => {
    ;['语言处理', 'Hëllø!', 'Family :: 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦'].forEach((tCase) => {
      const actual = run(string(tCase), tCase)
      const expected = result(true, tCase)

      should.matchState(actual, expected)
    })
  })

  it('should succeed if given a Unicode string followed by more input', () => {
    ;[
      ['语言', '语言处理'],
      ['Hëllø', 'Hëllø!!'],
      ['😀', '😀ok'],
    ].forEach(([tCase, tInput]) => {
      const actual = run(string(tCase), tInput)
      const expected = result(true, tCase)

      should.matchState(actual, expected)
    })
  })

  it('should succeed if given a repetitive input', () => {
    const tCase = 'test'

    const actual = run(string(tCase), tCase.repeat(2))
    const expected = result(true, tCase)

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const tCase = 'test'

    const actual = run(string(tCase), 'wrong')
    const expected = result(false, tCase)

    should.matchState(actual, expected)
  })

  it('should not advance pos on failure', () => {
    const actual = run(string('test'), 'wrong')

    should.beEqual(actual.isOk, false)
    should.beEqual(actual.pos, 0)
  })

  it('should fail if given a zero-length input', () => {
    const tCase = 'test'

    const actual = run(string(tCase), '')
    const expected = result(false, tCase)

    should.matchState(actual, expected)
  })

  it('should clamp the failure span to the end of input', () => {
    const actual = parseAt(string('abc'), 'ab', 0)
    should.matchResult(actual, { isOk: false, start: 0, end: 2, pos: 0, expected: 'abc' })
  })

  it('should succeed if given a single character mid-input', () => {
    const actual = parseAt(string('b'), 'abc', 1)
    should.matchResult(actual, { isOk: true, start: 1, end: 2, pos: 2, value: 'b' })
  })

  it('should fail if given a single character and a non-matching input', () => {
    const actual = parseAt(string('a'), 'xyz', 0)
    should.matchResult(actual, { isOk: false, start: 0, end: 1, pos: 0, expected: 'a' })
  })

  it('should clamp the single character failure span at the end of input', () => {
    const actual = parseAt(string('a'), 'xyz', 3)
    should.matchResult(actual, { isOk: false, start: 3, end: 3, pos: 3, expected: 'a' })
  })

  it('should succeed with a zero-width match if given an empty string', () => {
    const actual = parseAt(string(''), 'x', 0)
    should.matchResult(actual, { isOk: true, start: 0, end: 0, pos: 0, value: '' })
  })

  it('should not loop forever when a zero-width match is repeated', () => {
    const actual = run(many(string('')), 'x')
    const expected = result(true, [])

    should.matchState(actual, expected)
  })
})
