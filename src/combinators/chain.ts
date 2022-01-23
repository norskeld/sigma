import type { Parser } from '../state'

import { sequence } from './sequence'
import { many } from './many'
import { map } from './map'

type Fn<L, R> = (left: L, right: R) => L

function toLR<T, L extends T, R>(fn: Fn<T, R>) {
  return ([left, right]: [L, Array<R>]): T => {
    return right.reduce<T>((result, op) => fn(result, op), left)
  }
}

export function chainl<T, L extends T, R>(
  parser: Parser<L>,
  op: Parser<R>,
  fn: Fn<T, R>
): Parser<T> {
  return map(sequence(parser, many(op)), toLR(fn))
}
