import { lookahead, sequence, takeLeft } from '@combinators'
import { string, whitespace } from '@parsers'
import { run, should, describe, it } from '@testing'

describe('lookahead', () => {
  const parser = sequence(
    takeLeft(string('hello'), whitespace()),
    lookahead(string('let')),
    string('lettuce')
  )

  it('should successfully lookahead and return pos untouched', () => {
    const actual = run(parser, 'hello lettuce')

    should.beStrictEqual(actual, {
      isOk: true,
      span: [0, 13],
      pos: 13,
      value: ['hello', 'let', 'lettuce']
    })
  })

  it('should correctly fail if placed before a failing parser (OOB check)', () => {
    const actual = run(parser, 'hello let')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [6, 9],
      pos: 6,
      expected: 'lettuce'
    })
  })

  it('should correctly fail if given a failing parser (non-consuming check)', () => {
    const actual = run(parser, 'hello const')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [6, 9],
      pos: 6,
      expected: 'let'
    })
  })

  it('should return failure as is with the deepest pos', () => {
    const actual = run(lookahead(sequence(string('hello'), string(' world'))), 'hello there')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [5, 11],
      pos: 5,
      expected: ' world'
    })
  })
})
