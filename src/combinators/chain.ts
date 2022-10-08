import { many } from './many'
import { map } from './map'
import { sequence } from './sequence'

import type { Parser } from '@types'

/** @internal */
type Fn<L, R> = (left: L, right: R) => L

/** @internal */
function toLR<T, L extends T, R>(fn: Fn<T, R>) {
  return ([left, right]: [L, Array<R>]): T => {
    return right.reduce<T>((result, op) => fn(result, op), left)
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
  fn: Fn<T, R>
): Parser<T> {
  return map(sequence(parser, many(op)), toLR(fn))
}
