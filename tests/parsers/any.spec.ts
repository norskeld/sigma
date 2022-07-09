import { many } from '@combinators/many'
import { any } from '@parsers/any'
import { run, result, should, describe, testFailure, it } from '@test'

describe('any', () => {
  it('should succeed with a single character from the input stream', () => {
    const actual = run(any(), 'xyz')
    const expected = result(true, 'x')

    should.matchState(actual, expected)
  })

  it('should succeed only until it hits the end of input', () => {
    const actual = run(many(any()), 'xyz')
    const expected = result(true, ['x', 'y', 'z'])

    should.matchState(actual, expected)
  })

  it('should fail at the end of input', () => {
    testFailure('', any())
  })
})
