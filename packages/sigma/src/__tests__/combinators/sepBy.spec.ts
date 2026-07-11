import { sepBy, sepBy1, sequence } from '@combinators'
import { letter, nothing, string } from '@parsers'
import { describe, it, result, run, should } from '@testing'
import type { Parser } from '@types'

function countingSep(): Parser<null> & { calls(): number } {
  let calls = 0

  return {
    calls: () => calls,
    parse(_, pos) {
      calls += 1
      return { isOk: false, span: [pos, pos], pos, expected: 'separator' }
    },
  }
}

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

  it('should successfully continue if nothing matched', () => {
    const parser = sequence(sepBy(string('hello'), string('?')), sepBy(string('bye'), string('?')))
    const actual = run(parser, 'bye?bye?')
    const expected = result(true, [[], ['bye', 'bye']])

    should.matchState(actual, expected)
  })

  it('should collect values when the separator matches zero-width', () => {
    const parser = sepBy(letter(), nothing())
    const actual = run(parser, 'abc')
    const expected = result(true, ['a', 'b', 'c'])

    should.matchState(actual, expected)
  })

  it('should terminate when both parser and separator match zero-width', () => {
    const parser = sepBy(nothing(), nothing())
    const actual = run(parser, 'ab')
    const expected = result(true, [null])

    should.matchState(actual, expected)
  })

  it('should not invoke the separator when the first match consumes all input', () => {
    const sep = countingSep()
    const actual = run(sepBy(string('ab'), sep), 'ab')
    const expected = result(true, ['ab'])

    should.matchState(actual, expected)
    should.beEqual(sep.calls(), 0)
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

  it('should collect values when the separator matches zero-width', () => {
    const parser = sepBy1(letter(), nothing())
    const actual = run(parser, 'abc')
    const expected = result(true, ['a', 'b', 'c'])

    should.matchState(actual, expected)
  })

  it('should not invoke the separator when the first match consumes all input', () => {
    const sep = countingSep()
    const actual = run(sepBy1(string('ab'), sep), 'ab')
    const expected = result(true, ['ab'])

    should.matchState(actual, expected)
    should.beEqual(sep.calls(), 0)
  })
})
