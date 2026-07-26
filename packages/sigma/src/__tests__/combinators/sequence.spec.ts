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

    should.matchResult(actual, { isOk: true, start: 0, end: 2, pos: 2, value: ['a', 'b'] })
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

    should.matchResult(actual, {
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

  it('should fail and roll back when any parser after the first fails (arity 3)', () => {
    const parser = sequence(string('a'), string('b'), string('c'))

    should.matchState(run(parser, 'ax'), result(false, 'b'))
    should.matchState(run(parser, 'abx'), result(false, 'c'))
  })

  it('should fail and roll back when any parser after the first fails (arity 4)', () => {
    const parser = sequence(string('a'), string('b'), string('c'), string('d'))

    should.matchState(run(parser, 'ax'), result(false, 'b'))
    should.matchState(run(parser, 'abx'), result(false, 'c'))
    should.matchState(run(parser, 'abcx'), result(false, 'd'))
  })

  it('should fail and roll back when any parser after the first fails (arity 5)', () => {
    const parser = sequence(string('a'), string('b'), string('c'), string('d'), string('e'))

    should.matchState(run(parser, 'ax'), result(false, 'b'))
    should.matchState(run(parser, 'abx'), result(false, 'c'))
    should.matchState(run(parser, 'abcx'), result(false, 'd'))
    should.matchState(run(parser, 'abcdx'), result(false, 'e'))
  })

  it('should fail on the first parser at any arity', () => {
    const four = sequence(string('a'), string('b'), string('c'), string('d'))
    const five = sequence(string('a'), string('b'), string('c'), string('d'), string('e'))
    const many = sequence(...['a', 'b', 'c', 'd', 'e', 'f'].map(string))

    should.matchState(run(four, 'x'), result(false, 'a'))
    should.matchState(run(five, 'x'), result(false, 'a'))
    should.matchState(run(many, 'x'), result(false, 'a'))
  })
})
