import { string } from '@lib/internal/parsers/string'
import { lazy } from '@lib/internal/parsers/lazy'

import { run, result, should } from '@tests/@helpers'

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
