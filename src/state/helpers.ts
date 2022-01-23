import type { State, Failure, Success } from './state'

export function success<T>(state: State, value: T): Success<T> {
  return {
    kind: 'success',
    state,
    value
  }
}

export function failure(state: State, expected: string): Failure {
  return {
    kind: 'failure',
    state,
    expected
  }
}
