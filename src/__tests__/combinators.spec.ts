import { suite } from 'uvu'

import * as exposed from '../combinators'

import { should, expectedCombinators } from './@helpers'

const it = suite('combinators exports')

it('should expose combinators', () => {
  should.expose(exposed, ...expectedCombinators)
})

it.run()
