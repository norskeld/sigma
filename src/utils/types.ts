import type { Parser } from '#state'

/** Given a tuple of `Parser<T>`s, recursively extracts inner `T`s into a tuple. */
export type ToTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...ToTuple<Tail>]
  : []

/** Given a tuple of `Parser<T>`s, recursively extracts inner `T`s into a union. */
export type ToUnion<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? Head | ToUnion<Tail>
  : never

/** Given a union tuple of `Parser<T>`s, recursively extracts inner `T`s into a tuple. */
type UnwrapUnion<T> = T extends [Parser<infer Head> | Parser<infer Tail>]
  ? [Head, ...UnwrapUnion<Tail>]
  : []

/**
 * Given a union of `Parser<T>`s, folds it into a single`Parser` with a union of inner `T`s.
 * In other words, it folds `Parser<T1> | Parser<T2> | ...` into `Parser<T1 | T2 | ...>`
 */
export type ToParser<T> = UnwrapUnion<[T]> extends [infer R] ? Parser<R> : Parser<unknown>
