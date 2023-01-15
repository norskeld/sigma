import { defer, string, tryRun, ParserError } from '@parsers'
import { describe, result, should, testFailure, it } from '@testing'

describe('tryRun', () => {
  it('should succeed if given a succeeding parser', () => {
    const parser = string('runnable')
    const actual = tryRun(parser).with('runnable')
    const expected = result(true, 'runnable')

    should.matchState(actual, expected)
  })

  it('should fail if given a failing parser', () => {
    const deferred = defer<string>()

    deferred.with(string('deferred'))

    const actual = () => tryRun(deferred).with('lazy')
    const expected = new ParserError({ pos: 8, expected: 'deferred' })

    should.throwError(actual, expected)
  })

  it('should throw if given a non-initialized deferred parser', () => {
    testFailure('deferred', defer<string>())
  })
})
