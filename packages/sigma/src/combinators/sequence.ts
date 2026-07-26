import type { Parser, ToTuple, ToTupleOrArray } from '@types'
import { FAIL } from '@types'

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
    parse(ctx) {
      const start = ctx.pos

      const r1 = p1.parse(ctx)
      if (r1 === FAIL) return FAIL

      const r2 = p2.parse(ctx)

      if (r2 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      return [r1, r2] as Array<T>
    },
  }
}

/** @internal */
function sequence3<T>(p1: Parser<T>, p2: Parser<T>, p3: Parser<T>): Parser<Array<T>> {
  return {
    parse(ctx) {
      const start = ctx.pos

      const r1 = p1.parse(ctx)
      if (r1 === FAIL) return FAIL

      const r2 = p2.parse(ctx)

      if (r2 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      const r3 = p3.parse(ctx)

      if (r3 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      return [r1, r2, r3] as Array<T>
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
    parse(ctx) {
      const start = ctx.pos

      const r1 = p1.parse(ctx)
      if (r1 === FAIL) return FAIL

      const r2 = p2.parse(ctx)

      if (r2 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      const r3 = p3.parse(ctx)

      if (r3 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      const r4 = p4.parse(ctx)

      if (r4 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      return [r1, r2, r3, r4] as Array<T>
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
    parse(ctx) {
      const start = ctx.pos

      const r1 = p1.parse(ctx)
      if (r1 === FAIL) return FAIL

      const r2 = p2.parse(ctx)

      if (r2 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      const r3 = p3.parse(ctx)

      if (r3 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      const r4 = p4.parse(ctx)

      if (r4 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      const r5 = p5.parse(ctx)

      if (r5 === FAIL) {
        ctx.pos = start
        return FAIL
      }

      return [r1, r2, r3, r4, r5] as Array<T>
    },
  }
}

/** @internal */
export function sequenceN<T>(ps: Array<Parser<T>>): Parser<Array<T>> {
  const len = ps.length

  return {
    parse(ctx) {
      const start = ctx.pos

      // Fast-fail the first parser BEFORE allocating the 'values' array.
      const r0 = ps[0].parse(ctx)
      if (r0 === FAIL) return FAIL

      const values = new Array<T>(len)
      values[0] = r0 as T

      for (let index = 1; index < len; index++) {
        const result = ps[index].parse(ctx)

        if (result === FAIL) {
          ctx.pos = start
          return FAIL
        }

        values[index] = result as T
      }

      return values
    },
  }
}
