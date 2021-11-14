import * as exposed from '@lib/index'

import { defer, string } from '@lib/combinators'
import { run } from '@lib/index'

import { result, should } from '@tests/@setup/jest.helpers'

describe('internal/run', () => {
  it(`should expose 'run'`, () => {
    should.expose(exposed, 'run')
  })

  describe(run, () => {
    it(`should succeed`, () => {
      const parser = string('runnable')
      const actual = run(parser).with('runnable')
      const expected = result('success', 'runnable')

      should.matchState(actual, expected)
    })

    it(`should throw`, () => {
      const deferred = defer<string>()

      expect(() => {
        const actual = run(deferred).with('deferred')
        const expected = result('failure', 'deferred')

        should.matchState(actual, expected)
      }).toThrow()
    })

    it(`should fail`, () => {
      const deferred = defer<string>()

      deferred.with(string('deferred'))

      const actual = run(deferred).with('lazy')
      const expected = result('failure', 'deferred')

      should.matchState(actual, expected)
    })
  })
})
