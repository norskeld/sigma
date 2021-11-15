import * as exposed from '@lib/index'

import { should } from '@tests/@setup/jest.helpers'

describe('index.ts', () => {
  it(`should expose state helpers`, () => {
    should.expose(exposed, 'success', 'failure')
  })

  it(`should expose runner`, () => {
    should.expose(exposed, 'run')
  })

  it.todo(`should expose parsers`)
})
