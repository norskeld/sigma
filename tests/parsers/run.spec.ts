import { string } from '@lib/parsers/string'
import { defer } from '@lib/parsers/defer'
import { run } from '@lib/parsers/run'

import { result, should } from '@tests/@helpers'

describe(run, () => {
  it('should succeed if given a succeeding parser', () => {
    const parser = string('runnable')
    const actual = run(parser).with('runnable')
    const expected = result(true, 'runnable')

    should.matchState(actual, expected)
  })

  it('should fail if given a failing parser', () => {
    const deferred = defer<string>()

    deferred.with(string('deferred'))

    const actual = run(deferred).with('lazy')
    const expected = result(false, 'deferred')

    should.matchState(actual, expected)
  })

  it('should throw if given a non-initialized deferred parser', () => {
    const deferred = defer<string>()

    expect(() => {
      const actual = run(deferred).with('deferred')
      const expected = result(false, 'deferred')

      should.matchState(actual, expected)
    }).toThrow()
  })
})
