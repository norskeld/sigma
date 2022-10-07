import * as exposed from '#parsers'
import { should, expectedParsers, describe, it } from '#testing'

describe('parsers exports', () => {
  it('should expose parsers', () => {
    should.expose(exposed, ...expectedParsers)
  })
})
