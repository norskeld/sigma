import { nothing } from '@parsers/nothing'
import { describe, result, run, should, it } from '@test'

describe('nothing', () => {
  it('should succeed with null value', () => {
    const actual = run(nothing(), 'test')
    const expected = result(true, null)

    should.matchState(actual, expected)
  })
})
