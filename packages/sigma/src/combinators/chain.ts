import type { Parser } from '@types'
import { FAIL } from '@types'

/** @internal */
type TernaryFn<T, R> = (left: T, op: R, right: T) => T

/**
 * Parses *one* or more occurrences of `parser`, separated by `op` (in EBNF notation:
 * `parser (op parser)*`). Returns a value obtained by a recursive left-associative application of
 * `fn` to the values returned by `parser` and `op`. Left-associative counterpart of `chainr`.
 *
 * This combinator is particularly useful for eliminating left recursion, which typically occurs in
 * expression grammars.
 *
 * @param parser - Parser to apply
 * @param op - Separating parser
 * @param fn - Left-associative function to apply to the values returned by `parser` and `op`
 *
 * @returns Value from `fn`
 */
export function chainl<T, L extends T, R>(
  parser: Parser<L>,
  op: Parser<R>,
  fn: TernaryFn<T, R>,
): Parser<T> {
  return {
    parse(ctx) {
      const start = ctx.pos
      const first = parser.parse(ctx)

      if (first === FAIL) {
        return FAIL
      }

      let result: T = first as L
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        // Marked per iteration, so recoveries from successful pairs are kept.
        const mark = ctx.mark()
        const opResult = op.parse(ctx)

        if (opResult === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.reset(mark)

          break
        }

        const value = parser.parse(ctx)

        if (value === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.pos = last
          ctx.reset(mark)

          break
        }

        // The progress guard covers the whole op-value pair to discard zero-width matches.
        if (ctx.pos <= last) {
          ctx.pos = last
          ctx.reset(mark)

          break
        }

        result = fn(result, opResult as R, value as L)
        last = ctx.pos
      }

      return result
    },
  }
}

/**
 * Parses *one* or more occurrences of `parser`, separated by `op` (in EBNF notation:
 * `parser (op parser)*`). Returns a value obtained by a recursive right-associative application of
 * `fn` to the values returned by `parser` and `op`. Right-associative counterpart of `chainl`,
 * useful for operators like exponentiation.
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
  return {
    parse(ctx) {
      const start = ctx.pos
      const first = parser.parse(ctx)

      if (first === FAIL) {
        return FAIL
      }

      const values: Array<L> = [first as L]
      const ops: Array<R> = []
      const length = ctx.input.length

      let last = ctx.pos

      while (last < length) {
        // Marked per iteration, so recoveries from successful pairs are kept.
        const mark = ctx.mark()
        const opResult = op.parse(ctx)

        if (opResult === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.reset(mark)

          break
        }

        const value = parser.parse(ctx)

        if (value === FAIL) {
          if (ctx.fatal) {
            ctx.pos = start
            return FAIL
          }

          ctx.pos = last
          ctx.reset(mark)

          break
        }

        // The progress guard covers the whole op-value pair to discard zero-width matches.
        if (ctx.pos <= last) {
          ctx.pos = last
          ctx.reset(mark)

          break
        }

        ops.push(opResult as R)
        values.push(value as L)
        last = ctx.pos
      }

      let result: T = values[values.length - 1]

      for (let index = ops.length - 1; index >= 0; index--) {
        result = fn(values[index], ops[index], result)
      }

      return result
    },
  }
}
