import { nothing } from '../../parsers/nothing'
import { describe, result, run, should } from '../@helpers'

describe('nothing', (it) => {
  it('should succeed with null value', () => {
    const actual = run(nothing(), 'test')
    const expected = result(true, null)

    should.matchState(actual, expected)
  })
})
