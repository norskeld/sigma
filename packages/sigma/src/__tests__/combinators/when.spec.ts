import { choice, when } from '@combinators'
import { string } from '@parsers'
import { describe, it, result, run, should } from '@testing'

const parser = when(string('x'), () => string('y'))

describe('when', () => {
  it('should succeed with the value of chained parser', () => {
    const actual = run(parser, 'xy')
    const expected = result(true, 'y')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of context parser', () => {
    const actual = run(parser, 'ab')
    const expected = result(false, 'x')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of chained parser', () => {
    const actual = run(parser, 'xw')
    const expected = result(false, 'y')

    should.matchState(actual, expected)
  })

  it('should pass the context parser value and position to the callback', () => {
    let actual: unknown = null

    run(
      when(string('ab'), (ctx) => {
        actual = { ...ctx }

        return string('c')
      }),
      'abc',
    )

    should.beStrictEqual(actual, { value: 'ab', pos: 2, input: 'abc' })
  })

  it('should not consume input when the chained parser fails', () => {
    const parser = choice(
      when(string('ab'), () => string('z')),
      string('abc'),
    )

    const actual = run(parser, 'abc')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 3,
      pos: 3,
      value: 'abc',
    })
  })

  it('should report the failure of the chained parser at its own position', () => {
    const parser = when(string('ab'), () => string('z'))
    const actual = run(parser, 'abc')

    should.matchResult(actual, {
      isOk: false,
      start: 2,
      end: 3,
      pos: 2,
      expected: 'z',
    })
  })
})
