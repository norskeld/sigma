import { defer, run, string } from '@parsers'
import { describe, result, should, testFailure, it } from '@testing'

describe('run', () => {
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
    testFailure('deferred', defer<string>())
  })
})
