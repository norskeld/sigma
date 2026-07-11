import type { Parser } from '@types'

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
  return {
    parse(input, pos) {
      const r1 = p1.parse(input, pos)
      if (!r1.isOk) return r1

      const r2 = p2.parse(input, r1.pos)
      if (!r2.isOk) return r2

      return {
        isOk: true,
        span: [pos, r2.pos],
        pos: r2.pos,
        value: r1.value,
      }
    },
  }
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
  return {
    parse(input, pos) {
      const r1 = p1.parse(input, pos)
      if (!r1.isOk) return r1

      const r2 = p2.parse(input, r1.pos)
      if (!r2.isOk) return r2

      const r3 = p3.parse(input, r2.pos)
      if (!r3.isOk) return r3

      return {
        isOk: true,
        span: [pos, r3.pos],
        pos: r3.pos,
        value: r2.value,
      }
    },
  }
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
  return {
    parse(input, pos) {
      const r1 = p1.parse(input, pos)
      if (!r1.isOk) return r1

      const r2 = p2.parse(input, r1.pos)
      if (!r2.isOk) return r2

      return {
        isOk: true,
        span: [pos, r2.pos],
        pos: r2.pos,
        value: r2.value,
      }
    },
  }
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
  p3: Parser<T3>,
): Parser<[T1, T3]> {
  return {
    parse(input, pos) {
      const r1 = p1.parse(input, pos)
      if (!r1.isOk) return r1

      const r2 = p2.parse(input, r1.pos)
      if (!r2.isOk) return r2

      const r3 = p3.parse(input, r2.pos)
      if (!r3.isOk) return r3

      return {
        isOk: true,
        span: [pos, r3.pos],
        pos: r3.pos,
        value: [r1.value, r3.value],
      }
    },
  }
}
