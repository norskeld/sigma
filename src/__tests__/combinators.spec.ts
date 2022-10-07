import * as exposed from '#combinators'
import { should, expectedCombinators, describe, it } from '#testing'

describe('combinators exports', () => {
  it('should expose combinators', () => {
    should.expose(exposed, ...expectedCombinators)
  })
})
