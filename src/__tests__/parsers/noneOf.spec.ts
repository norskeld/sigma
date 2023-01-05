import { sequence } from '@combinators'
import { string, noneOf } from '@parsers'
import { run, result, should, describe, testFailure, it } from '@testing'

describe('noneOf', () => {
  it('should succeed with input character is not among given ones', () => {
    const actual = run(noneOf('xyz'), 'q-combinator')
    const expected = result(true, 'q')

    should.matchState(actual, expected)
  })

  it('should fail if input character is among given ones', () => {
    testFailure('y-combinator', noneOf('xyz'))
  })

  it('should fail if reached the end of input', () => {
    testFailure('prefix', sequence(string('prefix'), noneOf('XY')))
  })
})
