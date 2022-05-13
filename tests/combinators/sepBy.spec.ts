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

  it('should fail with the value of the first failed parser', () => {
    const parser = sepBy(string('hello'), string('?'))
    const actual = run(parser, 'bye?bye?')
    const expected = result(false, 'hello')

    should.matchState(actual, expected)
  })
})
