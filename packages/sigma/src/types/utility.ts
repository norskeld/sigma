import type { Parser } from './library'

/** @internal */
export type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (
  arg: infer I,
) => void
  ? I
  : never

/** @internal */
export type UnionToTuplePreserving<T> =
  UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
    ? [...UnionToTuplePreserving<Exclude<T, W>>, W]
    : []

/** @internal */
export type UnwrapParserTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...UnwrapParserTuple<Tail>]
  : []

/** @internal */
export type TupleToUnion<T> = T extends [infer Head, ...infer Rest]
  ? Head | TupleToUnion<Rest>
  : never

/**
 * Given a tuple of `Parser<T>`s, recursively extracts inner `T`s into a tuple.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>]
 * type R = ToTuple<U> // type R = [string, number, boolean]
 * ```
 */
export type ToTuple<T> = T extends [Parser<infer Head>, ...infer Tail]
  ? [Head, ...ToTuple<Tail>]
  : []

/**
 * Given a an array or a tuple of `Parser<T>`s, recursively extracts inner `T`s into a tuple or array.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>]
 * type R = ToTuple<U> // type R = [string, number, boolean]
 *
 * type A = Parser<Array<string>>
 * type T = ToTupleOrArray<A> // type T = string[]
 * ```
 */
export type ToTupleOrArray<T> =
  T extends Array<Parser<infer Inner>>
    ? Inner extends unknown
      ? T extends [Parser<infer Head>, ...infer Tail]
        ? [Head, ...ToTuple<Tail>]
        : Inner[]
      : []
    : []

/**
 * Given a tuple or an array of `Parser<T>`s, extracts the inner `T` of the first one.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>]
 * type R = ToFirst<U> // type R = string
 *
 * type A = Array<Parser<number>>
 * type T = ToFirst<A> // type T = number
 * ```
 */
export type ToFirst<T> = T extends [Parser<infer Head>, ...Array<unknown>]
  ? Head
  : T extends Array<Parser<infer Inner>>
    ? Inner
    : never

/**
 * Given a tuple or an array of `Parser<T>`s, extracts the inner `T` of the last one.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>]
 * type R = ToLast<U> // type R = boolean
 *
 * type A = Array<Parser<number>>
 * type T = ToLast<A> // type T = number
 * ```
 */
export type ToLast<T> = T extends [...Array<unknown>, Parser<infer Tail>]
  ? Tail
  : T extends Array<Parser<infer Inner>>
    ? Inner
    : never

/**
 * Given a tuple or an array of `Parser<T>`s, extracts the inner `T`s of all but the first and the
 * last ones into a tuple or an array.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>, Parser<string>]
 * type R = ToInner<U> // type R = [number, boolean]
 *
 * type A = Array<Parser<number>>
 * type T = ToInner<A> // type T = number[]
 * ```
 */
export type ToInner<T> = T extends [Parser<unknown>, ...infer Mid, Parser<unknown>]
  ? ToTuple<Mid>
  : T extends Array<Parser<infer Inner>>
    ? Array<Inner>
    : never

/**
 * Given a tuple of `Parser<T>`s, recursively extracts inner `T`s into a union.
 *
 * @example
 *
 * ```ts
 * type U = [Parser<string>, Parser<number>, Parser<boolean>]
 * type R = ToUnion<U> // type R = string | number | boolean
 *
 * type U = Array<Parser<number>>
 * type R = ToUnion<U> // type R = number
 * ```
 */
export type ToUnion<T> =
  T extends Array<Parser<infer Inner>>
    ? Inner
    : T extends [Parser<infer Head>, ...infer Tail]
      ? Head | ToUnion<Tail>
      : never

/**
 * Given a union of `Parser<T>`s, recursively extracts their inner `T`s into a tuple.
 *
 * @example
 *
 * ```ts
 * type U = Parser<string> | Parser<number> | Parser<boolean>
 * type R = UnwrapUnion<U> // type R = [string, number, boolean]
 * ```
 */
export type UnwrapUnion<T> = UnwrapParserTuple<UnionToTuplePreserving<T>>

/**
 * Given a union of `Parser<T>`s, folds it into a single`Parser` with a union of inner `T`s.
 * In other words, it folds `Parser<T1> | Parser<T2> | ...` into `Parser<T1 | T2 | ...>`.
 *
 * Note: Technically, the result will be `SafeParser<T1 | T2 | ...> | UnsafeParser<T1 | T2 | ...>`,
 * but no worries, it's the definition of the `Parser<T>`.
 *
 * @example
 *
 * ```ts
 * type U = Parser<string> | Parser<number> | Parser<boolean>
 * type R = ToParser<U> // type R = Parser<string | number | boolean>
 * ```
 */
export type ToParser<T> = UnwrapUnion<T> extends infer R ? Parser<TupleToUnion<R>> : Parser<unknown>
