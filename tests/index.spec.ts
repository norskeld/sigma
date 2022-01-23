import * as exposed from '@lib/index'

import { should } from '@tests/@helpers'

it('should expose state helpers', () => {
  should.expose(exposed, 'success', 'failure')
})
