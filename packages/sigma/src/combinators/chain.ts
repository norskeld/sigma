import type { Parser } from '@types'

import { many } from './many'
import { map } from './map'
import { sequence } from './sequence'

/** @internal */
type Fn<L, R> = (left: L, right: R) => L

/** @internal */
type TernaryFn<T, R> = (left: T, op: R, right: T) => T

/** @internal */
function toLR<T, L extends T, R>(fn: Fn<T, R>) {
  return ([left, right]: [L, Array<R>]): T => {
    return right.reduce<T>((result, op) => fn(result, op), left)
  }
}

/** @internal */
function toRL<T, L extends T, R>(fn: TernaryFn<T, R>) {
  return ([first, rest]: [L, Array<[R, L]>]): T => {
    if (rest.length === 0) {
      return first
    }

    let result: T = rest[rest.length - 1][1]

    for (let index = rest.length - 1; index > 0; index--) {
      result = fn(rest[index - 1][1], rest[index][0], result)
    }

    return fn(first, rest[0][0], result)
  }
}

/**
 * Parses *zero* or more occurrences of `parser`, separated by `op` (in [EBNF] notation:
 * `parser (op parser)*`). Returns a value obtained by a recursive left-associative application of
 * `fn` to the values returned by `op` and `parser`.
 *
 * This combinator is particularly useful for eliminating left recursion, which typically occurs in
 * expression grammars.
 *
 * [EBNF]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form
 *
 * @param parser - Parser to apply
 * @param op - Separating parser
 * @param fn - Left-associative function to apply to the values returned by `op` and `parser`
 *
 * @returns Value from `fn`
 */
export function chainl<T, L extends T, R>(
  parser: Parser<L>,
  op: Parser<R>,
  fn: Fn<T, R>,
): Parser<T> {
  return map(sequence(parser, many(op)), toLR(fn))
}

/**
 * Parses *zero* or more occurrences of `parser`, separated by `op` (in [EBNF] notation:
 * `parser (op parser)*`). Returns a value obtained by a recursive right-associative application of
 * `fn` to the values returned by `parser` and `op`. Right-associative counterpart of `chainl`,
 * useful for operators like exponentiation.
 *
 * [EBNF]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form
 *
 * @param parser - Parser to apply
 * @param op - Separating parser
 * @param fn - Right-associative function to apply to the values returned by `parser` and `op`
 *
 * @returns Value from `fn`
 */
export function chainr<T, L extends T, R>(
  parser: Parser<L>,
  op: Parser<R>,
  fn: TernaryFn<T, R>,
): Parser<T> {
  return map(sequence(parser, many(sequence(op, parser))), toRL(fn))
}
