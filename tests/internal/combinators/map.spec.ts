import * as exposed from '@lib/combinators'
import { map, mapTo, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/map', () => {
  it(`should expose 'map' and 'mapTo'`, () => {
    should.expose(exposed, 'map', 'mapTo')
  })

  describe(map, () => {
    it(`should succeed if a single given parser succeeds`, () => {
      const parser = map(string('9000'), (value) => parseInt(value, 10))
      const actual = run(parser, '9000')
      const expected = result('success', 9000)

      should.matchState(actual, expected)
    })

    it(`should fail if a single given parser fails`, () => {
      const parser = map(string('9000'), (value) => parseInt(value, 10))
      const actual = run(parser, 'xxxx')
      const expected = result('failure', '9000')

      should.matchState(actual, expected)
    })
  })

  describe(mapTo, () => {
    it(`should succeed if a single given parser succeeds`, () => {
      const parser = mapTo(string('9000'), 'mapped-to-constant')
      const actual = run(parser, '9000')
      const expected = result('success', 'mapped-to-constant')

      should.matchState(actual, expected)
    })
  })
})
