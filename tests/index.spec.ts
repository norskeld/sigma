import { should, expectedParsers, expectedCombinators, describe, it } from './@helpers'

import * as exposed from '@main'

describe('index exports', () => {
  it('should re-export combinators', () => {
    should.expose(exposed, ...expectedCombinators)
  })

  it('should re-export parsers', () => {
    should.expose(exposed, ...expectedParsers)
  })
})
