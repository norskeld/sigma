import { sequence } from '@combinators'
import { noneOf, string } from '@parsers'
import { describe, it, result, run, should, testFailure } from '@testing'

describe('noneOf', () => {
  it('should succeed with input character is not among given ones', () => {
    const actual = run(noneOf('xyz'), 'q-combinator')
    const expected = result(true, 'q')

    should.matchState(actual, expected)
  })

  it('should fail if input character is among given ones', () => {
    testFailure('y-combinator', noneOf('xyz'))
  })

  it('should not advance pos on failure', () => {
    const actual = run(noneOf('xyz'), 'y-combinator')

    should.beEqual(actual.isOk, false)
    should.beEqual(actual.pos, 0)
  })

  it('should reject characters outside the Basic Multilingual Plane', () => {
    testFailure('💩!', noneOf('💩'))
  })

  it('should fail if reached the end of input', () => {
    testFailure('prefix', sequence(string('prefix'), noneOf('XY')))
  })

  it('should fail listing all rejected characters including duplicates', () => {
    const actual = noneOf('aab').parse('a', 0)

    should.beStrictEqual(actual, {
      isOk: false,
      span: [0, 0],
      pos: 0,
      expected: 'none of: a, a, b',
    })
  })

  it('should fail with the exact end of input message', () => {
    const actual = noneOf('xy').parse('', 0)

    should.beStrictEqual(actual, {
      isOk: false,
      span: [0, 0],
      pos: 0,
      expected: 'noneOf @ reached the end of input',
    })
  })
})
