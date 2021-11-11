import * as exposed from '@lib/combinators'
import { lazy, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/lazy', () => {
  it(`should expose 'lazy'`, () => {
    should.expose(exposed, 'lazy')
  })

  describe(lazy, () => {
    it(`should succeed with value of the lazily evaluated parser`, () => {
      const parser = lazy(() => string('lazy-loaded'))
      const actual = run(parser, 'lazy-loaded')
      const expected = result('success', 'lazy-loaded')

      should.matchState(actual, expected)
    })

    it(`should fail with expectation of the lazily evaluated parser`, () => {
      const parser = lazy(() => string('spok!'))
      const actual = run(parser, 'speak!')
      const expected = result('failure', 'spok!')

      should.matchState(actual, expected)
    })
  })
})
