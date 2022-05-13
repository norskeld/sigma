import * as exposed from '@lib/index'

import { should } from '@tests/@helpers'

import { expectedCombinators } from './combinators.spec'
import { expectedParsers } from './parsers.spec'

it('should re-export combinators', () => {
  should.expose(exposed, ...expectedCombinators)
})

it('should re-export parsers', () => {
  should.expose(exposed, ...expectedParsers)
})
