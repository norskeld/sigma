import { sepBy, sepBy1 } from '#combinators'
import { string } from '#parsers'
import { run, result, should, describe, it } from '#testing'

describe('sepBy', () => {
  it('should succeed with an array of matched strings without separator', () => {
    const parser = sepBy(string('x'), string('!'))
    const actual = run(parser, 'x!x!x!')
    const expected = result(true, ['x', 'x', 'x'])

    should.matchState(actual, expected)
  })

  it(`should succeed with an array of matched string if separator didn't match`, () => {
    const parser = sepBy(string('x'), string('!'))
    const actual = run(parser, 'x-y')
    const expected = result(true, ['x'])

    should.matchState(actual, expected)
  })

  it('should succeed with an empty array if nothing matched', () => {
    const parser = sepBy(string('hello'), string('?'))
    const actual = run(parser, 'bye?bye?')
    const expected = result(true, [])

    should.matchState(actual, expected)
  })
})

describe('sepBy1', () => {
  it('should succeed with an array of matched strings without separator', () => {
    const parser = sepBy1(string('x'), string('!'))
    const actual = run(parser, 'x!x!x!')
    const expected = result(true, ['x', 'x', 'x'])

    should.matchState(actual, expected)
  })

  it(`should succeed with an array of matched string if separator didn't match`, () => {
    const parser = sepBy1(string('x'), string('!'))
    const actual = run(parser, 'x-y')
    const expected = result(true, ['x'])

    should.matchState(actual, expected)
  })

  it('should fail with expectation of the parser if nothing matched', () => {
    const parser = sepBy1(string('hello'), string('?'))
    const actual = run(parser, 'bye?bye?')
    const expected = result(false, 'hello')

    should.matchState(actual, expected)
  })
})
