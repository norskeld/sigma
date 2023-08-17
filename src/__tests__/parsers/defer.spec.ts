import { string, defer } from '@parsers'
import { run, result, should, describe, it } from '@testing'

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
})
