import { attempt, choice, sequence } from '@combinators'
import { string } from '@parsers'
import { run, should, describe, it } from '@testing'

describe('attempt', () => {
  it('should behave like the wrapped parser on success', () => {
    const parser = sequence(string('hello'), attempt(string(' world')))
    const actual = run(parser, 'hello world')

    should.beStrictEqual(actual, {
      isOk: true,
      span: [0, 11],
      pos: 11,
      value: ['hello', ' world']
    })
  })

  it('should reset failure pos to the entry position', () => {
    const parser = attempt(sequence(string('hello'), string(' world')))
    const actual = run(parser, 'hello there')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [5, 11],
      pos: 0,
      expected: ' world'
    })
  })

  it('should exclude a failure from deepest-failure selection in choice', () => {
    const first = sequence(string('foo'), string('bar'))
    const second = sequence(string('fo'), string('x'))

    const plain = run(choice(first, second), 'football')

    should.beStrictEqual(plain, {
      isOk: false,
      span: [3, 6],
      pos: 3,
      expected: 'bar'
    })

    const attempted = run(choice(attempt(first), second), 'football')

    should.beStrictEqual(attempted, {
      isOk: false,
      span: [2, 3],
      pos: 2,
      expected: 'x'
    })
  })
})
