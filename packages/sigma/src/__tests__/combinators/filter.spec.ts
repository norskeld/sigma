import { filter } from '@combinators'
import { integer } from '@parsers'
import { describe, it, result, run, should } from '@testing'

describe('filter', () => {
  const parser = filter(integer(), (value) => value >= 0 && value <= 65535, 'port number')

  it('should succeed with the value if the predicate passes', () => {
    const actual = run(parser, '8080')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 4,
      pos: 4,
      value: 8080,
    })
  })

  it('should fail with expected if the predicate rejects the value', () => {
    const actual = run(parser, '70000')

    should.matchResult(actual, {
      isOk: false,
      start: 0,
      end: 5,
      pos: 0,
      expected: 'port number',
    })
  })

  it('should propagate the failure of the wrapped parser', () => {
    const actual = run(parser, 'x')
    const expected = result(false, 'integer number')

    should.matchState(actual, expected)
  })
})
