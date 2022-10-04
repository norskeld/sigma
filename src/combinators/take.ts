import type { Parser } from '../state'

import { map } from './map'
import { sequence } from './sequence'

const toLeft = <T1, T2>([left]: [T1, T2]): T1 => left
const toMiddle = <T1, T2, T3>([, middle]: [T1, T2, T3]): T2 => middle
const toRight = <T1, T2>([, right]: [T1, T2]): T2 => right
const toSides = <T1, T2, T3>([left, _, right]: [T1, T2, T3]): [T1, T3] => [left, right]

/**
 * Takes exactly **two** parsers and applies them in order, returning the result of the leftmost
 * `p1` parser.
 *
 * @param p1 - First parser to apply
 * @param p2 - Second parser to apply
 *
 * @returns Result of the leftmost `p1` parser
 */
export function takeLeft<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T1> {
  return map(sequence(p1, p2), toLeft)
}

/**
 * Takes exactly **three** parsers and applies them in order, returning the result of the `p2`
 * parser in the middle.
 *
 * @param p1 - First parser to apply
 * @param p2 - Second parser to apply
 * @param p3 - Third parser to apply
 *
 * @returns Result of the `p2` parser in the middle
 */
export function takeMid<T1, T2, T3>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>): Parser<T2> {
  return map(sequence(p1, p2, p3), toMiddle)
}

/**
 * Takes exactly **two** parsers and applies them in order, returning the result of the rightmost
 * `p2` parser.
 *
 * @param p1 - First parser to apply
 * @param p2 - Second parser to apply
 *
 * @returns Result of the rightmost `p2` parser
 */
export function takeRight<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T2> {
  return map(sequence(p1, p2), toRight)
}

/**
 * Takes exactly **three** parsers and applies them in order, returning a tuple of the results of
 * `p1` and `p3` parsers.
 *
 * @param p1 - First parser to apply
 * @param p2 - Second parser to apply
 * @param p3 - Third parser to apply
 *
 * @returns Results of `p1` and `p3` parsers as a tuple
 */
export function takeSides<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<[T1, T3]> {
  return map(sequence(p1, p2, p3), toSides)
}
