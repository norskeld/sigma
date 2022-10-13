import { many, many1 } from '@combinators'
import { string } from '@parsers'
import { describe, result, run, should, testFailure, it } from '@testing'

describe('many', () => {
  it('should succeed with an array of matched strings', () => {
    const parser = many(string('x!'))
    const actual = run(parser, 'x!x!x!')
    const expected = result(true, ['x!', 'x!', 'x!'])

    should.matchState(actual, expected)
  })

  it('should succeed with an empty array even if nothing matched', () => {
    const parser = many(string('hello'))
    const actual = run(parser, 'byebye')
    const expected = result(true, [])

    should.matchState(actual, expected)
  })
})
describe('many1', () => {
  it('should succeed with an array of matched strings', () => {
    const parser = many1(string('x!'))
    const actual = run(parser, 'x!x!x!')
    const expected = result(true, ['x!', 'x!', 'x!'])

    should.matchState(actual, expected)
  })

  it('should fail if nothing matched', () => {
    testFailure('y!y!y!', many1(string('x!')))
  })

  it('should fail with the expectation of the parser', () => {
    const parser = many1(string('x!'))
    const actual = run(parser, 'a!b!c!')
    const expected = result(false, 'x!')

    should.matchState(actual, expected)
  })
})
