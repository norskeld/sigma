import * as exposed from '@lib/combinators'
import { many, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/many', () => {
  it(`should expose 'many'`, () => {
    should.expose(exposed, 'many')
  })

  describe(many, () => {
    it(`should succeed with an array of matched strings`, () => {
      const parser = many(string('-+'))
      const actual = run(parser, '-+-+-+-+')
      const expected = result('success', ['-+', '-+', '-+', '-+'])

      should.matchState(actual, expected)
    })

    it(`should succeed with an empty array even if nothing matched`, () => {
      const parser = many(string('hello'))
      const actual = run(parser, 'byebye')
      const expected = result('success', [])

      should.matchState(actual, expected)
    })
  })
})
