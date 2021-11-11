import * as exposed from '@lib/combinators'
import { defer, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/defer', () => {
  it(`should expose 'defer'`, () => {
    should.expose(exposed, 'defer')
  })

  describe(defer, () => {
    it(`should succeed if the deferred parser is set`, () => {
      const deferred = defer<string>()

      deferred.with(string('deferred'))

      const actual = run(deferred, 'deferred')
      const expected = result('success', 'deferred')

      should.matchState(actual, expected)
    })

    it(`should throw if the deferred parser is not set`, () => {
      const deferred = defer<string>()

      expect(() => {
        const actual = run(deferred, 'deferred')
        const expected = result('failure', 'deferred')

        should.matchState(actual, expected)
      }).toThrow()
    })

    it(`should fail if the deferred parser fails`, () => {
      const deferred = defer<string>()

      deferred.with(string('deferred'))

      const actual = run(deferred, 'lazy')
      const expected = result('failure', 'deferred')

      should.matchState(actual, expected)
    })
  })
})
