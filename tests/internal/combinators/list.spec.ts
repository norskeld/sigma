import { list } from '@lib/internal/combinators/list'
import { string } from '@lib/internal/parsers/string'

import { run, result, should } from '@tests/@helpers'

describe(list, () => {
  it('should succeed with an array of matched strings without separator', () => {
    const parser = list(string('x'), string('!'))
    const actual = run(parser, 'x!x!x!')
    const expected = result('success', ['x', 'x', 'x'])

    should.matchState(actual, expected)
  })

  it('should fail with the value of the first failed parser', () => {
    const parser = list(string('hello'), string('?'))
    const actual = run(parser, 'bye?bye?')
    const expected = result('failure', 'hello')

    should.matchState(actual, expected)
  })
})
