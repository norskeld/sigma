import { noneOf } from '../../parsers/noneOf'
import { run, result, should, describe, testFailure } from '../@helpers'

describe('noneOf', (it) => {
  it('should succeed with input character is not among given ones', () => {
    const actual = run(noneOf('xyz'), 'q-combinator')
    const expected = result(true, 'q')

    should.matchState(actual, expected)
  })

  it('should fail if input character is among given ones', () => {
    testFailure('y-combinator', noneOf('xyz'))
  })
})
