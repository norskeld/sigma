import { Parser } from '../state'

import { sequence } from './sequence'
import { many } from './many'
import { map } from './map'

function toList<T, S>([list, pair]: [T, Array<[S, T]>]): Array<T> {
  return [list].concat(pair.map(([, value]: [S, T]) => value))
}

export function list<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>> {
  return map(sequence(parser, many(sequence(sep, parser))), toList)
}

export { list as sepBy }
