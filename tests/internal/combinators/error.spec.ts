import * as exposed from '@lib/internal/combinators/error'
import { error } from '@lib/internal/combinators/error'
import { string } from '@lib/internal/combinators/string'

import { run, result, shouldExpose } from '@tests/@setup/jest.helpers'

describe('internal/combinators/error', () => {
  it(`exposes 'error'`, () => {
    shouldExpose(exposed, 'error')
  })

  describe(error, () => {
    it(`should successfully replace error message (expectation)`, () => {
      const parser = error(string('9000'), 'replaced-error-message')
      const actual = run(parser, 'xxxx')
      const expected = result('failure', 'replaced-error-message')

      expect(actual).toHaveState(expected)
    })
  })
})
