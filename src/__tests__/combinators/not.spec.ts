import { not, takeLeft } from '@combinators'
import { letter, string } from '@parsers'
import { run, should, describe, it } from '@testing'

describe('not', () => {
  const parser = takeLeft(string('let'), not(letter(), 'keyword boundary'))

  it('should succeed with null without consuming input if parser fails', () => {
    const actual = run(parser, 'let x')

    should.beStrictEqual(actual, {
      isOk: true,
      span: [0, 3],
      pos: 3,
      value: 'let'
    })
  })

  it('should succeed with an empty span when applied standalone', () => {
    const actual = run(not(string('a')), 'b')

    should.beStrictEqual(actual, {
      isOk: true,
      span: [0, 0],
      pos: 0,
      value: null
    })
  })

  it('should fail with expected if parser succeeds', () => {
    const actual = run(parser, 'letx')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [3, 4],
      pos: 3,
      expected: 'keyword boundary'
    })
  })

  it('should fail with the default message if expected is omitted', () => {
    const actual = run(not(string('a')), 'abc')

    should.beStrictEqual(actual, {
      isOk: false,
      span: [0, 1],
      pos: 0,
      expected: 'unexpected input'
    })
  })
})
