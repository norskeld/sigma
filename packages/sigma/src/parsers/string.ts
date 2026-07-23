import type { Parser } from '@types'

/** @internal */
export type StringConstraint<T extends string> = T extends `${infer _}${infer _}`
  ? T
  : 'expected at least one character'

/**
 * Parses a string.
 *
 * @param match - String to parse
 *
 * @returns Parsed string
 */
export function string<const T extends string>(match: StringConstraint<T>): Parser<string> {
  const length = match.length
  const codes = match.split('').map((char) => char.charCodeAt(0))

  return {
    parse(ctx) {
      const input = ctx.input
      const pos = ctx.pos
      const end = pos + length

      // Manual charCodeAt comparison stays on the JIT fast path, unlike String#startsWith.
      if (end <= input.length) {
        let index = 0

        while (index < length && input.charCodeAt(pos + index) === codes[index]) {
          index++
        }

        if (index === length) {
          ctx.pos = end
          return match
        }
      }

      return ctx.fail(match, Math.min(end, input.length))
    },
  }
}
