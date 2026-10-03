import * as exposed from '@parsers'
import { describe, expectedParsers, it, should } from '@testing'

describe('parsers exports', () => {
  it('should expose parsers', () => {
    should.expose(exposed, ...expectedParsers)
  })
})
