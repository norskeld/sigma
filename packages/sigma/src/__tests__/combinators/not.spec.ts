import { first, not } from '@combinators'
import { letter, string } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('not', () => {
  const parser = first(string('let'), not(letter(), 'keyword boundary'))

  it('should succeed with null without consuming input if parser fails', () => {
    const actual = run(parser, 'let x')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: 'let',
    })
  })

  it('should succeed with an empty span when applied standalone', () => {
    const actual = run(not(string('a')), 'b')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 0,
      pos: 0,
      value: null,
    })
  })

  it('should fail with expected if parser succeeds', () => {
    const actual = run(parser, 'letx')

    should.matchResult(actual, {
      isOk: false,
      start: 3,
      end: 4,
      pos: 3,
      expected: 'keyword boundary',
    })
  })

  it('should fail with the default message if expected is omitted', () => {
    const actual = run(not(string('a')), 'abc')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 1,
      pos: 0,
      expected: 'unexpected input',
    })
  })
})
