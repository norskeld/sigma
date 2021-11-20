import { nothing } from '@lib/internal/parsers/nothing'

import { run, result, should } from '@tests/@helpers'

describe(nothing, () => {
  it('should succeed with null value', () => {
    const actual = run(nothing(), 'test')
    const expected = result('success', null)

    should.matchState(actual, expected)
  })
})
