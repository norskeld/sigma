import { choice, commit, inner } from '@combinators'
import { defer, string } from '@parsers'
import { describe, it, result, run, should } from '@testing'

describe('defer', () => {
  it('should succeed if the deferred parser succeeds', () => {
    const deferred = defer<string>()

    deferred.with(string('deferred'))

    const actual = run(deferred, 'deferred')
    const expected = result(true, 'deferred')

    should.matchState(actual, expected)
  })

  it('should fail if the deferred parser fails', () => {
    const deferred = defer<string>()

    deferred.with(string('deferred'))

    const actual = run(deferred, 'lazy')
    const expected = result(false, 'deferred')

    should.matchState(actual, expected)
  })

  it('should throw if the deferred parser is not set', () => {
    const parser = defer<string>()

    should.throwError(() => {
      run(parser, '')
    }, new Error('Deferred parser was not initialized'))
  })

  it('should propagate a committed failure from a recursive parser', () => {
    const nested = defer<string>()

    // `(((x` never closes, so the commit fires at the innermost level.
    nested.with(choice(inner(string('('), nested, commit(string(')'), 'close')), string('x')))

    const actual = run(nested, '(((x')

    should.matchResult(actual, {
      isOk: false,
      start: 4,
      end: 4,
      pos: 4,
      expected: ')',
      label: 'close',
    })
  })
})
