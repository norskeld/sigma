import { chainl } from '@lib/internal/combinators/chain'
import { map } from '@lib/internal/combinators/map'
import { regexp } from '@lib/internal/parsers/regexp'
import { string } from '@lib/internal/parsers/string'
import { takeRight } from '@lib/internal/combinators/take'

import { run, result, should } from '@tests/@helpers'

describe(chainl, () => {
  const toSum = (left: number, right: number) => left + right
  const toNumber = (value: string) => parseInt(value, 10)

  const number = map(regexp(/\d+/g, 'integer'), toNumber)
  const parser = chainl(number, takeRight(string(' + '), number), toSum)

  it('should succeed with eliminated left recursion and reduced to a value', () => {
    const actual = run(parser, '2 + 2 + 4')
    const expected = result('success', 8)

    should.matchState(actual, expected)
  })

  it('should fail with expectation of the regexp parser', () => {
    const actual = run(parser, 'x + x + 4')
    const expected = result('failure', 'integer')

    should.matchState(actual, expected)
  })
})
