import { commit, many, recover, syncPast } from '@combinators'
import { defer, run, string } from '@parsers'
import { describe, it, result, should } from '@testing'
import type { Parser } from '@types'
import { EMPTY_ERRORS, FAIL } from '@types'

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

  it('should throw if given a parser that throws', () => {
    const parser = defer<string>()

    should.throwError(() => {
      run(parser).with('')
    }, new Error('Deferred parser was not initialized'))
  })

  it('should share the empty error list when nothing was recovered', () => {
    should.beEqual(run(string('a')).with('a').errors, EMPTY_ERRORS)
    should.beEqual(run(string('a')).with('z').errors, EMPTY_ERRORS)
  })

  it('should report recovered failures on a successful result', () => {
    const parser = many(recover(commit(string('a'), 'x'), syncPast(string(';')), () => 'recovered'))
    const actual = run(parser).with('z;')

    should.beEqual(actual.isOk, true)
    should.matchErrors(actual, ['a'])
  })

  it('should report a swallowed commit rather than a truncated parse', () => {
    // A hand-written combinator that ignores the commitment protocol.
    const swallowing = <T>(parser: Parser<T>): Parser<T | null> => ({
      parse(ctx) {
        const value = parser.parse(ctx)

        return value === FAIL ? null : value
      },
    })

    const actual = run(swallowing(commit(string('a'), 'x'))).with('z')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'a',
      label: 'x',
    })
  })
})
