import { when } from '@combinators'
import { string } from '@parsers'
import { run, result, should, describe, it } from '@testing'

const parser = when(string('x'), () => string('y'))

describe('when', () => {
  it('should succeed with the value of chained parser', () => {
    const actual = run(parser, 'xy')
    const expected = result(true, 'y')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of context parser', () => {
    const actual = run(parser, 'ab')
    const expected = result(false, 'x')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of chained parser', () => {
    const actual = run(parser, 'xw')
    const expected = result(false, 'y')

    should.matchState(actual, expected)
  })
})
