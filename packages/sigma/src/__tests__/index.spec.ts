import * as exposed from '@lib'
import { describe, expectedCombinators, expectedCore, expectedParsers, it, should } from '@testing'

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

  it('should not re-export sequence internals', () => {
    should.notExpose(exposed, 'sequence2', 'sequence3', 'sequence4', 'sequence5', 'sequenceN')
  })
})
