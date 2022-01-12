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

/** Given an array of `Parser`s, recursively extracts their types into a tuple. */
export type ToTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...ToTuple<Tail>]
  : []
