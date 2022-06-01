import { type Parser } from '../state'

/** Given an array of `Parser`s, recursively extracts their types into a tuple. */
export type ToTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...ToTuple<Tail>]
  : []

/** Given an array of `Parser`s, recursively extracts their types into a union. */
export type ToUnion<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? Head | ToUnion<Tail>
  : never

/** Given a union tuple of `Parser`s of `T`, unwraps them and returns a union tuple of `T`s. */
type UnwrapUnion<T> = T extends [Parser<infer Head> | Parser<infer Tail>]
  ? [Head, ...UnwrapUnion<Tail>]
  : []

/**
 * Given a union of `Parser`s, folds it into a `Parser` with a union of inner value types.
 * In other words, it folds `Parser<T1> | Parser<T2> | ...` into `Parser<T1 | T2 | ...>`
 */
export type ToParser<T> = UnwrapUnion<[T]> extends [infer R] ? Parser<R> : Parser<unknown>
