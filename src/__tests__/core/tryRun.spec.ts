import { defer, string, tryRun, ParserError, run } from '@parsers'
import { describe, result, should, it } from '@testing'

describe('tryRun', () => {
  it('should succeed if given a succeeding parser', () => {
    const parser = string('runnable')
    const actual = tryRun(parser).with('runnable')
    const expected = result(true, 'runnable')

    should.matchState(actual, expected)
  })

  it('should throw if given a failing parser', () => {
    const deferred = defer<string>()

    deferred.with(string('deferred'))

    const actual = () => tryRun(deferred).with('lazy')
    const expected = new ParserError({ pos: 8, span: [0, 4], expected: 'deferred' })

    should.throwError(actual, expected)
  })

  it('should throw if given a parser that throws', () => {
    const parser = defer<string>()

    should.throwError(() => {
      run(parser).with('')
    }, new Error('Deferred parser was not initialized'))
  })
})
