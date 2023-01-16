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
      pos: 13,
      value: ['hello', 'let', 'lettuce']
    })
  })

  it('should correctly fail if placed before a failing parser (OOB check)', () => {
    const actual = run(parser, 'hello let')

    should.beStrictEqual(actual, {
      isOk: false,
      pos: 9,
      expected: 'lettuce'
    })
  })

  it('should correctly fail if given a failing parser (consuming check)', () => {
    const actual = run(parser, 'hello const')

    should.beStrictEqual(actual, {
      isOk: false,
      pos: 9,
      expected: 'let'
    })
  })
})
