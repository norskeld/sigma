import * as exposed from '@lib'
import { should, expectedCore, expectedParsers, expectedCombinators, describe, it } from '@testing'

describe('index exports', () => {
  it('should re-export core', () => {
    should.expose(exposed, ...expectedCore)
  })

  it('should re-export combinators', () => {
    should.expose(exposed, ...expectedCombinators)
  })

  it('should re-export parsers', () => {
    should.expose(exposed, ...expectedParsers)
  })
})
