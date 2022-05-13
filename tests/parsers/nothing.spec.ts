import { nothing } from '@lib/parsers/nothing'

import { run, result, should } from '@tests/@helpers'

describe(nothing, () => {
  it('should succeed with null value', () => {
    const actual = run(nothing(), 'test')
    const expected = result(true, null)

    should.matchState(actual, expected)
  })
})
