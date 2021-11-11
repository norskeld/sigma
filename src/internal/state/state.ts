export interface Parser<T> {
  parse(state: State): Result<T>
}

export interface State {
  text: string
  index: number
}

export interface Failure {
  readonly kind: 'failure'
  readonly state: State
  readonly expected: string
}

export interface Success<T> {
  readonly kind: 'success'
  readonly state: State
  readonly value: T
}

export type Result<T> = Success<T> | Failure
