import { many } from '@combinators'
import { string } from '@parsers'
import { describe, it, result, run, should } from '@testing'

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
    const actual = string('abc').parse('ab', 0)

    should.beStrictEqual(actual, { isOk: false, span: [0, 2], pos: 0, expected: 'abc' })
  })

  it('should succeed with a zero-width match if given an empty string', () => {
    const actual = string('').parse('x', 0)

    should.beStrictEqual(actual, { isOk: true, span: [0, 0], pos: 0, value: '' })
  })

  it('should not loop forever when a zero-width match is repeated', () => {
    const actual = run(many(string('')), 'x')
    const expected = result(true, [])

    should.matchState(actual, expected)
  })
})
