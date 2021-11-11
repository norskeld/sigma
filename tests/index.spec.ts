import * as exposed from '@lib/index'

import { should } from '@tests/@setup/jest.helpers'

describe('index.ts', () => {
  it(`should expose state helpers`, () => {
    should.expose(exposed, 'success', 'failure')
  })

  it(`should expose combinators`, () => {
    should.expose(exposed, 'string', 'str')
    should.expose(exposed, 'regexp', 're')
  })

  it.todo(`should expose parsers`)
})
