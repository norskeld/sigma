import { sequence } from '@combinators'
import { string } from '@parsers'
import { describe, it, result, run, should } from '@testing'

describe('sequence', () => {
  it('should succeed if a sequence of parsers succeeds', () => {
    const parser = sequence(string('hello'), string(' '), string('world'))
    const actual = run(parser, 'hello world')
    const expected = result(true, ['hello', ' ', 'world'])

    should.matchState(actual, expected)
  })

  it('should fail if a sequence of parsers fails somewhere', () => {
    const parser = sequence(string('hello'), string(' '), string('world'))
    const actual = run(parser, 'bye friend')
    const expected = result(false, 'hello')

    should.matchState(actual, expected)
  })

  it('should succeed with two parsers', () => {
    const parser = sequence(string('a'), string('b'))
    const actual = run(parser, 'ab')

    should.beStrictEqual(actual, { isOk: true, start: 0, end: 2, pos: 2, value: ['a', 'b'] })
  })

  it('should succeed with four parsers', () => {
    const parser = sequence(string('a'), string('b'), string('c'), string('d'))
    const actual = run(parser, 'abcd')
    const expected = result(true, ['a', 'b', 'c', 'd'])

    should.matchState(actual, expected)
  })

  it('should succeed with five parsers', () => {
    const parser = sequence(string('a'), string('b'), string('c'), string('d'), string('e'))
    const actual = run(parser, 'abcde')
    const expected = result(true, ['a', 'b', 'c', 'd', 'e'])

    should.matchState(actual, expected)
  })

  it('should succeed with more than five parsers', () => {
    const ps = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(string)
    const parser = sequence(...ps)
    const actual = run(parser, 'abcdefg')

    should.beStrictEqual(actual, {
      isOk: true,
      start: 0,
      end: 7,
      pos: 7,
      value: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    })
  })

  it('should fail with the failure of the failing parser at any arity', () => {
    const two = sequence(string('a'), string('x'))
    const many = sequence(...['a', 'b', 'c', 'd', 'e', 'x'].map(string))

    should.matchState(run(two, 'ab'), result(false, 'x'))
    should.matchState(run(many, 'abcdef'), result(false, 'x'))
  })
})
