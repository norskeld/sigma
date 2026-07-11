import { sequence } from '@combinators'
import { fail, string } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('fail', () => {
  it('should always fail with the given message', () => {
    const actual = run(fail('boom'), 'anything')

    should.beStrictEqual(actual, {
      isOk: false,
      start: 0,
      end: 0,
      pos: 0,
      expected: 'boom',
    })
  })

  it('should fail at the current position without consuming input', () => {
    const actual = run(sequence(string('a'), fail('nope')), 'abc')

    should.beStrictEqual(actual, {
      isOk: false,
      start: 1,
      end: 1,
      pos: 1,
      expected: 'nope',
    })
  })
})
