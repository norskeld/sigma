import { sequenceN } from '@combinators/sequence'
import type { Parser, ToFirst, ToInner, ToLast } from '@types'
import { FAIL } from '@types'

/** @internal */
type Parsers2 = [Parser<unknown>, Parser<unknown>, ...Array<Parser<unknown>>]

/** @internal */
type Parsers3 = [...Parsers2, Parser<unknown>]

/** @internal */
type Parsers4 = [...Parsers3, Parser<unknown>]

/**
 * Applies `ps` parsers in order, until *all* of them succeed, returning the value of the *first*
 * one. Requires at least two parsers.
 *
 * @param ps - Parsers to apply
 *
 * @returns Value returned by the first parser
 */
export function first<T extends Parsers2>(...ps: T): Parser<ToFirst<T>>
export function first(...ps: Array<Parser<unknown>>): Parser<unknown> {
  if (ps.length === 2) {
    return {
      parse(ctx) {
        const start = ctx.pos
        const r1 = ps[0].parse(ctx)

        if (r1 === FAIL) {
          return FAIL
        }

        if (ps[1].parse(ctx) === FAIL) {
          ctx.pos = start
          return FAIL
        }

        return r1
      },
    }
  }

  const seq = sequenceN(ps)

  return {
    parse(ctx) {
      const values = seq.parse(ctx)
      return values === FAIL ? FAIL : values[0]
    },
  }
}

/**
 * Applies `ps` parsers in order, until *all* of them succeed, returning the values of all but the
 * *first* and the *last* ones. Requires at least three parsers.
 *
 * With exactly three parsers the value of the middle one is returned as is; with more, the values
 * in between are returned as a tuple.
 *
 * @param ps - Parsers to apply
 *
 * @returns Value returned by the middle parser, or a tuple of values in between
 */
export function inner<T1, T2, T3>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>): Parser<T2>
export function inner<T extends Parsers4>(...ps: T): Parser<ToInner<T>>
export function inner(...ps: Array<Parser<unknown>>): Parser<unknown> {
  if (ps.length === 3) {
    return {
      parse(ctx) {
        const start = ctx.pos

        if (ps[0].parse(ctx) === FAIL) {
          return FAIL
        }

        const r2 = ps[1].parse(ctx)

        if (r2 === FAIL) {
          ctx.pos = start
          return FAIL
        }

        if (ps[2].parse(ctx) === FAIL) {
          ctx.pos = start
          return FAIL
        }

        return r2
      },
    }
  }

  const seq = sequenceN(ps)
  const end = ps.length - 1

  return {
    parse(ctx) {
      const values = seq.parse(ctx)
      return values === FAIL ? FAIL : values.slice(1, end)
    },
  }
}

/**
 * Applies `ps` parsers in order, until *all* of them succeed, returning the value of the *last*
 * one. Requires at least two parsers.
 *
 * @param ps - Parsers to apply
 *
 * @returns Value returned by the last parser
 */
export function last<T extends Parsers2>(...ps: T): Parser<ToLast<T>>
export function last(...ps: Array<Parser<unknown>>): Parser<unknown> {
  if (ps.length === 2) {
    return {
      parse(ctx) {
        const start = ctx.pos

        if (ps[0].parse(ctx) === FAIL) {
          return FAIL
        }

        const r2 = ps[1].parse(ctx)

        if (r2 === FAIL) {
          ctx.pos = start
          return FAIL
        }

        return r2
      },
    }
  }

  const seq = sequenceN(ps)
  const end = ps.length - 1

  return {
    parse(ctx) {
      const values = seq.parse(ctx)
      return values === FAIL ? FAIL : values[end]
    },
  }
}

/**
 * Applies `ps` parsers in order, until *all* of them succeed, returning the values of the *first*
 * and the *last* ones as a tuple. Requires at least three parsers.
 *
 * @param ps - Parsers to apply
 *
 * @returns Values returned by the first and the last parsers as a tuple
 */
export function outer<T extends Parsers3>(...ps: T): Parser<[ToFirst<T>, ToLast<T>]>
export function outer(...ps: Array<Parser<unknown>>): Parser<unknown> {
  if (ps.length === 3) {
    return {
      parse(ctx) {
        const start = ctx.pos
        const r1 = ps[0].parse(ctx)

        if (r1 === FAIL) {
          return FAIL
        }

        if (ps[1].parse(ctx) === FAIL) {
          ctx.pos = start
          return FAIL
        }

        const r3 = ps[2].parse(ctx)

        if (r3 === FAIL) {
          ctx.pos = start
          return FAIL
        }

        return [r1, r3]
      },
    }
  }

  const seq = sequenceN(ps)
  const end = ps.length - 1

  return {
    parse(ctx) {
      const values = seq.parse(ctx)
      return values === FAIL ? FAIL : [values[0], values[end]]
    },
  }
}
