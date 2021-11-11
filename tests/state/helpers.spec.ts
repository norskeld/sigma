import { State, Success, Failure } from '@lib/internal/state/state'
import { success, failure } from '@lib/internal/state/helpers'

import * as exposed from '@lib/internal/state/helpers'

describe('internal/state/helpers', () => {
  const value = 'value'
  const expected = 'value'

  const state: State = {
    text: 'test',
    index: 0
  }

  it('exposes specific functions', () => {
    expect(exposed).toHaveProperty('success')
    expect(exposed).toHaveProperty('failure')
  })

  describe(success, () => {
    it('constructs correct success object', () => {
      const actual = success({ ...state }, value)
      const result: Success<typeof value> = { kind: 'success', state, value }

      expect(actual).toStrictEqual(result)
    })
  })

  describe(failure, () => {
    it('constructs correct failure object', () => {
      const actual = failure({ ...state }, value)
      const result: Failure = { kind: 'failure', state, expected }

      expect(actual).toStrictEqual(result)
    })
  })
})
