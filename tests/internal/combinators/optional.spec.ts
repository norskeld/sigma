import * as exposed from '@lib/combinators'
import { sequence, optional, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/sequence', () => {
  it(`should expose 'optional' ('opt')`, () => {
    should.expose(exposed, 'optional', 'opt')
  })

  describe(optional, () => {
    it(`should succeed with the where optional non-matched value replaced with null`, () => {
      // TODO: This seems to be broken somehow? Because `optional` eats everything after 'Hello'...
      const parser = sequence(string('Hello'), optional(string('...')))
      const actual = run(parser, 'Hello')
      const expected = result('success', ['Hello', null])

      should.matchState(actual, expected)
    })

    it(`should succeed with null anyway`, () => {
      const parser = optional(string('left'))
      const actual = run(parser, 'between')
      const expected = result('success', null)

      should.matchState(actual, expected)
    })
  })
})
