import * as exposed from '@combinators'
import { describe, expectedCombinators, it, should } from '@testing'

describe('combinators exports', () => {
  it('should expose combinators', () => {
    should.expose(exposed, ...expectedCombinators)
  })
})
