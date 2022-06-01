export interface Parser<T> {
  parse(input: string, pos: number): Result<T>
}

export type Failure = {
  readonly isOk: false
  readonly pos: number
  readonly expected: string
}

export type Success<T> = {
  readonly isOk: true
  readonly pos: number
  readonly value: T
}

export type Result<T> = Success<T> | Failure
