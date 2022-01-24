import * as exposed from '@lib/combinators'

import { should } from '@tests/@helpers'

export const expectedCombinators = [
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
] as const

it('should expose combinators', () => {
  should.expose(exposed, ...expectedCombinators)
})
