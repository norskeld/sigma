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

/** Given an array of `Parser`s, recursively extracts their types into a tuple. */
export type ToTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...ToTuple<Tail>]
  : []

/** Given an array of `Parser`s, recursively extracts their types into a union. */
export type ToUnion<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? Head | ToUnion<Tail>
  : never
