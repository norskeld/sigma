import { it, describe, should, expectedCombinators } from './@helpers'

import * as exposed from '@combinators'

describe('combinators', () => {
  it('should expose correct exports', () => {
    should.expose(exposed, ...expectedCombinators)
  })
})
