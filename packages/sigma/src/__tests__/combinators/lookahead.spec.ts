import { first, lookahead, sequence } from '@combinators'
import { string, whitespace } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('lookahead', () => {
  const parser = sequence(
    first(string('hello'), whitespace()),
    lookahead(string('let')),
    string('lettuce'),
  )

  it('should successfully lookahead and return pos untouched', () => {
    const actual = run(parser, 'hello lettuce')

    should.beStrictEqual(actual, {
      isOk: true,
      start: 0,
      end: 13,
      pos: 13,
      value: ['hello', 'let', 'lettuce'],
    })
  })

  it('should correctly fail if placed before a failing parser (OOB check)', () => {
    const actual = run(parser, 'hello let')

    should.beStrictEqual(actual, {
      isOk: false,
      start: 6,
      end: 9,
      pos: 6,
      expected: 'lettuce',
    })
  })

  it('should correctly fail if given a failing parser (non-consuming check)', () => {
    const actual = run(parser, 'hello const')

    should.beStrictEqual(actual, {
      isOk: false,
      start: 6,
      end: 9,
      pos: 6,
      expected: 'let',
    })
  })

  it('should return failure as is with the deepest pos', () => {
    const actual = run(lookahead(sequence(string('hello'), string(' world'))), 'hello there')

    should.beStrictEqual(actual, {
      isOk: false,
      start: 5,
      end: 11,
      pos: 5,
      expected: ' world',
    })
  })
})
