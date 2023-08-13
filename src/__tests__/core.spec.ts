import * as exposed from '@core'
import { should, expectedCore, describe, it } from '@testing'

describe('parsers exports', () => {
  it('should expose parsers', () => {
    should.expose(exposed, ...expectedCore)
  })
})
