import * as exposed from '@parsers'
import { should, expectedParsers, it, describe } from '@test'

describe('parsers', () => {
  it('should expose correct exports', () => {
    should.expose(exposed, ...expectedParsers)
  })
})
