import * as exposed from '@lib/combinators'

import { should } from '@tests/@helpers'

it(`should expose combinators`, () => {
  should.expose(
    exposed,
    'chainl',
    'choice',
    'alt',
    'error',
    'list',
    'sepBy',
    'many',
    'map',
    'mapTo',
    'optional',
    'opt',
    'sequence',
    'seq',
    'takeLeft',
    'tleft',
    'takeMid',
    'tmid',
    'takeRight',
    'tright'
  )
})
