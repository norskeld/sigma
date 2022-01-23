import { Parser } from '../state'

import { sequence } from './sequence'
import { map } from './map'

const toLeft = <T1, T2>([left]: [T1, T2]): T1 => left
const toMiddle = <T1, T2, T3>([, middle]: [T1, T2, T3]): T2 => middle
const toRight = <T1, T2>([, right]: [T1, T2]): T2 => right
const toSides = <T1, T2, T3>([left, _, right]: [T1, T2, T3]): [T1, T3] => [left, right]

export function takeLeft<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T1> {
  return map(sequence(p1, p2), toLeft)
}

export function takeMid<T1, T2, T3>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>): Parser<T2> {
  return map(sequence(p1, p2, p3), toMiddle)
}

export function takeRight<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T2> {
  return map(sequence(p1, p2), toRight)
}

export function takeSides<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<[T1, T3]> {
  return map(sequence(p1, p2, p3), toSides)
}
