import * as exposed from '@lib/combinators'
import { string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/string', () => {
  it(`should expose 'string' ('str')`, () => {
    should.expose(exposed, 'string', 'str')
  })

  describe(string, () => {
    const ok = 'test'
    const err = 'text'
    const repetitive = 'testtest'
    const zero = ''

    const parser = string(ok)

    it(`should succeed if matches the input`, () => {
      const actual = run(parser, ok)
      const expected = result('success', ok)

      should.matchState(actual, expected)
    })

    it(`should succeed if given repetitive input`, () => {
      const actual = run(parser, repetitive)
      const expected = result('success', ok)

      should.matchState(actual, expected)
    })

    it(`should fail if doesn't match the input`, () => {
      const actual = run(parser, err)
      const expected = result('failure', ok)

      should.matchState(actual, expected)
    })

    it(`should fail if given zero input`, () => {
      const actual = run(parser, zero)
      const expected = result('failure', ok)

      should.matchState(actual, expected)
    })
  })
})
