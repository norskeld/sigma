import * as exposed from '@lib/combinators'

import { should } from '@tests/@helpers'

it('should expose combinators', () => {
  should.expose(
    exposed,
    'chainl',
    'choice',
    'error',
    'sepBy',
    'many',
    'map',
    'mapTo',
    'optional',
    'sequence',
    'takeLeft',
    'takeMid',
    'takeRight',
    'takeSides'
  )
})
