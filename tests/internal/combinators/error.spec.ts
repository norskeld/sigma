import * as exposed from '@lib/combinators'
import { error, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/error', () => {
  it(`should expose 'error'`, () => {
    should.expose(exposed, 'error')
  })

  describe(error, () => {
    it(`should successfully replace error message (expectation)`, () => {
      const parser = error(string('9000'), 'replaced-error-message')
      const actual = run(parser, 'xxxx')
      const expected = result('failure', 'replaced-error-message')

      should.matchState(actual, expected)
    })

    it(`should not do anything if a parser succeeds`, () => {
      const parser = error(string('9000'), 'replaced-error-message')
      const actual = run(parser, '9000')
      const expected = result('success', '9000')

      should.matchState(actual, expected)
    })
  })
})
