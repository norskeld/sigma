import { attempt, sequence, takeLeft } from '@combinators'
import { string, whitespace } from '@parsers'
import { run, should, describe, it } from '@testing'

describe('attempt', () => {
  const parser = sequence(
    takeLeft(string('hello'), whitespace()),
    attempt(string('let')),
    string('lettuce')
  )

  it('should successfully attempt and return pos untouched', () => {
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
      pos: 9,
      expected: 'lettuce'
    })
  })

  it('should correctly fail if given a failing parser (non-consuming check)', () => {
    const actual = run(parser, 'hello const')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [6, 6],
      pos: 6,
      expected: 'let'
    })
  })
})
