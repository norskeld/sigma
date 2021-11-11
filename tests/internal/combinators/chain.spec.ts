import * as exposed from '@lib/combinators'
import { chainl, map, regexp, string, takeRight } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/chainl', () => {
  it(`should expose 'chainl'`, () => {
    should.expose(exposed, 'chainl')
  })

  describe(chainl, () => {
    it(`should succeed with eliminated left recursion and reduced to a value`, () => {
      function toNumber(value: string): number {
        return parseInt(value, 10)
      }

      function toSum(left: number, right: number): number {
        return left + right
      }

      const number = map(regexp(/\d+/g, 'integer'), toNumber)
      const parser = chainl(number, takeRight(string(' + '), number), toSum)

      const actual = run(parser, '2 + 2 + 4')
      const expected = result('success', 8)

      should.matchState(actual, expected)
    })

    it(`should fail with expectation of the regexp parser`, () => {
      function toNumber(value: string): number {
        return parseInt(value, 10)
      }

      function toSum(left: number, right: number): number {
        return left + right
      }

      const number = map(regexp(/\d+/g, 'integer'), toNumber)
      const parser = chainl(number, takeRight(string(' + '), number), toSum)

      const actual = run(parser, 'x + x + 4')
      const expected = result('failure', 'integer')

      should.matchState(actual, expected)
    })
  })
})
