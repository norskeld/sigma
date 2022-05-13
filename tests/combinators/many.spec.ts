import { many } from '@lib/combinators/many'
import { string } from '@lib/parsers/string'

import { run, result, should } from '@tests/@helpers'

describe(many, () => {
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
