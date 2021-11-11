import { shouldExpose } from '@tests/@setup/jest.helpers'
import * as exposed from '@lib/index'

describe('index.ts', () => {
  it('exposes state helpers', () => {
    shouldExpose(exposed, 'success', 'failure')
  })

  it('exposes combinators', () => {
    shouldExpose(exposed, 'string', 'str')
    shouldExpose(exposed, 'regexp', 're')
  })

  it.todo('exposes parsers')
})
