import { count } from '@combinators'
import { any, string } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('count', () => {
  it('should apply parser exactly n times and collect values', () => {
    const actual = run(count(any(), 4), 'abcdef')

    should.beStrictEqual(actual, {
      isOk: true,
      span: [0, 4],
      pos: 4,
      value: ['a', 'b', 'c', 'd'],
    })
  })

  it('should resolve to an empty array if n is less than one', () => {
    const actual = run(count(string('a'), 0), 'aaa')

    should.beStrictEqual(actual, {
      isOk: true,
      span: [0, 0],
      pos: 0,
      value: [],
    })
  })

  it('should propagate the first failure', () => {
    const actual = run(count(string('ab'), 3), 'ababx')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [4, 5],
      pos: 4,
      expected: 'ab',
    })
  })
})
