import * as exposed from '@lib'
import { should, expectedParsers, expectedCombinators, describe, it } from '@testing'

describe('index exports', () => {
  it('should re-export combinators', () => {
    should.expose(exposed, ...expectedCombinators)
  })

  it('should re-export parsers', () => {
    should.expose(exposed, ...expectedParsers)
  })
})
