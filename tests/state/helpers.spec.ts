import { State, Success, Failure } from '@lib/state/state'
import { success, failure } from '@lib/state/helpers'

describe(success, () => {
  it('should construct a success object if given a state object and value', () => {
    const value = 'value'
    const state: State = {
      text: 'test',
      index: 0
    }

    const actual = success({ ...state }, value)
    const result: Success<typeof value> = { kind: 'success', state, value }

    expect(actual).toStrictEqual(result)
  })
})

describe(failure, () => {
  it('should construct a failure object if given a state object and expectation message', () => {
    const value = 'value'
    const expected = 'value'
    const state: State = {
      text: 'test',
      index: 0
    }

    const actual = failure({ ...state }, value)
    const result: Failure = { kind: 'failure', state, expected }

    expect(actual).toStrictEqual(result)
  })
})
