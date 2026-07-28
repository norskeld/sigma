import * as exposed from '@core'
import { describe, expectedCore, it, should } from '@testing'

describe('parsers exports', () => {
  it('should expose parsers', () => {
    should.expose(exposed, ...expectedCore)
  })
})
