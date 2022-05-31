import { sepBy } from '@lib/combinators/sepBy'
import { string } from '@lib/parsers/string'

import { run, result, should } from '@tests/@helpers'

describe(sepBy, () => {
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
