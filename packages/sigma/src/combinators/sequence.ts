import type { Parser, ToTuple, ToTupleOrArray } from '@types'

/**
 * Applies `ps` parsers in order, until *all* of them succeed.
 *
 * @param ps - Parsers to apply
 *
 * @returns Tuple of values returned by `ps` parsers
 */
export function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTuple<T>>
export function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTupleOrArray<T>>
export function sequence<T>(...ps: Array<Parser<T>>): Parser<Array<T>> {
  switch (ps.length) {
    case 2:
      return sequence2(ps[0], ps[1])
    case 3:
      return sequence3(ps[0], ps[1], ps[2])
    case 4:
      return sequence4(ps[0], ps[1], ps[2], ps[3])
    case 5:
      return sequence5(ps[0], ps[1], ps[2], ps[3], ps[4])
    default:
      return sequenceN(ps)
  }
}

/** @internal */
function sequence2<T>(p1: Parser<T>, p2: Parser<T>): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const r1 = p1.parse(input, pos)
      if (!r1.isOk) return r1

      const r2 = p2.parse(input, r1.pos)
      if (!r2.isOk) return r2

      return {
        isOk: true,
        start: pos,
        end: r2.pos,
        pos: r2.pos,
        value: [r1.value, r2.value],
      }
    },
  }
}

/** @internal */
function sequence3<T>(p1: Parser<T>, p2: Parser<T>, p3: Parser<T>): Parser<Array<T>> {
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
        start: pos,
        end: r3.pos,
        pos: r3.pos,
        value: [r1.value, r2.value, r3.value],
      }
    },
  }
}

/** @internal */
function sequence4<T>(
  p1: Parser<T>,
  p2: Parser<T>,
  p3: Parser<T>,
  p4: Parser<T>,
): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const r1 = p1.parse(input, pos)
      if (!r1.isOk) return r1

      const r2 = p2.parse(input, r1.pos)
      if (!r2.isOk) return r2

      const r3 = p3.parse(input, r2.pos)
      if (!r3.isOk) return r3

      const r4 = p4.parse(input, r3.pos)
      if (!r4.isOk) return r4

      return {
        isOk: true,
        start: pos,
        end: r4.pos,
        pos: r4.pos,
        value: [r1.value, r2.value, r3.value, r4.value],
      }
    },
  }
}

/** @internal */
function sequence5<T>(
  p1: Parser<T>,
  p2: Parser<T>,
  p3: Parser<T>,
  p4: Parser<T>,
  p5: Parser<T>,
): Parser<Array<T>> {
  return {
    parse(input, pos) {
      const r1 = p1.parse(input, pos)
      if (!r1.isOk) return r1

      const r2 = p2.parse(input, r1.pos)
      if (!r2.isOk) return r2

      const r3 = p3.parse(input, r2.pos)
      if (!r3.isOk) return r3

      const r4 = p4.parse(input, r3.pos)
      if (!r4.isOk) return r4

      const r5 = p5.parse(input, r4.pos)
      if (!r5.isOk) return r5

      return {
        isOk: true,
        start: pos,
        end: r5.pos,
        pos: r5.pos,
        value: [r1.value, r2.value, r3.value, r4.value, r5.value],
      }
    },
  }
}

/** @internal */
function sequenceN<T>(ps: Array<Parser<T>>): Parser<Array<T>> {
  const len = ps.length

  return {
    parse(input, pos) {
      // Fast-fail the first parser BEFORE allocating the 'values' array
      const r0 = ps[0].parse(input, pos)
      if (!r0.isOk) return r0

      const values = new Array<T>(len)
      values[0] = r0.value
      let nextPos = r0.pos

      for (let index = 1; index < len; index++) {
        const result = ps[index].parse(input, nextPos)
        if (!result.isOk) return result

        values[index] = result.value
        nextPos = result.pos
      }

      return {
        isOk: true,
        start: pos,
        end: nextPos,
        pos: nextPos,
        value: values,
      }
    },
  }
}
