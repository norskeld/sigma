import * as exposed from '@lib/internal/combinators/map'
import { map, mapTo } from '@lib/internal/combinators/map'
import { string } from '@lib/internal/combinators/string'

import { run, result, shouldExpose } from '@tests/@setup/jest.helpers'

describe('internal/combinators/map', () => {
  it(`exposes 'map' and 'mapTo'`, () => {
    shouldExpose(exposed, 'map', 'mapTo')
  })

  describe(map, () => {
    it(`should result in success if a single given parser succeeds`, () => {
      const parser = map(string('9000'), Number)
      const actual = run(parser, '9000')
      const expected = result('success', 9000)

      expect(actual).toHaveState(expected)
    })
  })

  describe(mapTo, () => {
    it(`should result in success if a single given parser succeeds`, () => {
      const parser = mapTo(string('9000'), 'mapped-to-constant')
      const actual = run(parser, '9000')
      const expected = result('success', 'mapped-to-constant')

      expect(actual).toHaveState(expected)
    })
  })
})
