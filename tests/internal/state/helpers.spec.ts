import * as exposed from '@lib/index'
import { success, failure, State, Success, Failure } from '@lib/index'

import { should } from '@tests/@setup/jest.helpers'

describe('internal/state/helpers', () => {
  const value = 'value'
  const expected = 'value'

  const state: State = {
    text: 'test',
    index: 0
  }

  it(`should expose 'success' and 'failure'`, () => {
    should.expose(exposed, 'success', 'failure')
  })

  describe(success, () => {
    it('should construct a success object', () => {
      const actual = success({ ...state }, value)
      const result: Success<typeof value> = { kind: 'success', state, value }

      expect(actual).toStrictEqual(result)
    })
  })

  describe(failure, () => {
    it('should construct a failure object', () => {
      const actual = failure({ ...state }, value)
      const result: Failure = { kind: 'failure', state, expected }

      expect(actual).toStrictEqual(result)
    })
  })
})
