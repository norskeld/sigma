import { sequence } from '@combinators'
import { string, oneOf } from '@parsers'
import { run, result, should, describe, testFailure, it } from '@testing'

describe('oneOf', () => {
  it('should succeed if input character is among given ones', () => {
    const actual = run(oneOf('xyz'), 'y-combinator')
    const expected = result(true, 'y')

    should.matchState(actual, expected)
  })

  it('should fail if input character is not among given ones', () => {
    testFailure('q-combinator', oneOf('xyz'))
  })

  it('should match characters outside the Basic Multilingual Plane', () => {
    const actual = run(oneOf('💩x'), '💩!')
    const expected = result(true, '💩')

    should.matchState(actual, expected)
  })

  it('should fail if reached the end of input', () => {
    testFailure('prefix', sequence(string('prefix'), oneOf('XY')))
  })

  it('should fail listing all expected characters including duplicates', () => {
    const actual = oneOf('aab').parse('q', 0)

    should.beStrictEqual(actual, { isOk: false, span: [0, 0], pos: 0, expected: 'one of: a, a, b' })
  })

  it('should fail with the exact end of input message', () => {
    const actual = oneOf('xy').parse('', 0)

    should.beStrictEqual(actual, {
      isOk: false,
      span: [0, 0],
      pos: 0,
      expected: 'oneOf @ reached the end of input'
    })
  })
})
