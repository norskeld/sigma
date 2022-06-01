import { type Parser } from '../state'

/** Given an array of `Parser`s, recursively extracts their types into a tuple. */
export type ToTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...ToTuple<Tail>]
  : []

/** Given an array of `Parser`s, recursively extracts their types into a union. */
export type ToUnion<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? Head | ToUnion<Tail>
  : never
