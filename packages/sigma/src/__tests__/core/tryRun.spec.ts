import { commit, many, recover, syncPast } from '@combinators'
import { ParserError, defer, run, string, tryRun } from '@parsers'
import { describe, it, result, should } from '@testing'

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
    const expected = new ParserError({
      pos: 8,
      start: 0,
      end: 4,
      expected: 'deferred',
      label: null,
    })

    should.throwError(actual, expected)
  })

  it('should throw if given a parser that throws', () => {
    const parser = defer<string>()

    should.throwError(() => {
      run(parser).with('')
    }, new Error('Deferred parser was not initialized'))
  })

  it('should throw even when every failure was recovered', () => {
    const parser = many(recover(commit(string('a'), 'x'), syncPast(string(';')), () => 'recovered'))

    // `run` tolerates recovered failures, `tryRun` does not.
    should.beEqual(run(parser).with('z;').isOk, true)

    let thrown: ParserError | null = null

    try {
      tryRun(parser).with('z;')
    } catch (error) {
      thrown = error as ParserError
    }

    should.beEqual(thrown?.message, 'a')
    should.beEqual(thrown?.label, 'x')
    should.beEqual(thrown?.errors.length, 1)
  })
})
