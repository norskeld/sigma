import { suite } from 'uvu'

import { string } from '../../parsers/string'
import { defer } from '../../parsers/defer'
import { run } from '../../parsers/run'

import { result, should, testFailure } from '../@helpers'

const it = suite('run')

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
  testFailure('deffered', defer<string>())
})

it.run()
