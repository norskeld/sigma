import { oneOf } from '../../parsers/oneOf'
import { run, result, should, describe, testFailure } from '../@helpers'

describe('oneOf', (it) => {
  it('should succeed if input character is among given ones', () => {
    const actual = run(oneOf('xyz'), 'y-combinator')
    const expected = result(true, 'y')

    should.matchState(actual, expected)
  })

  it('should fail if input character is not among given ones', () => {
    testFailure('q-combinator', oneOf('xyz'))
  })
})
