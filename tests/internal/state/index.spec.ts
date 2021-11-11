import * as exposed from '@lib/internal/state'

import { should } from '@tests/@setup/jest.helpers'

describe('internal/state/index.ts', () => {
  it(`should expose 'success' and 'failure'`, () => {
    should.expose(exposed, 'success', 'failure')
  })
})
