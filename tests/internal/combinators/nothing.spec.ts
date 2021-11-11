import * as exposed from '@lib/combinators'
import { nothing } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/nothing', () => {
  it(`should expose 'nothing' ('nil')`, () => {
    should.expose(exposed, 'nothing', 'nil')
  })

  describe(nothing, () => {
    it(`should succeed with null value`, () => {
      const actual = run(nothing(), 'test')
      const expected = result('success', null)

      should.matchState(actual, expected)
    })
  })
})
