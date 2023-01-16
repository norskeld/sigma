import type { Parser, Span } from '@types'

/**
 * Simply resolves to `null`.
 *
 * @returns `null`.
 */
export function nothing(): Parser<null> {
  return {
    parse(_, pos) {
      return {
        isOk: true,
        span: [pos, pos] as Span,
        pos,
        value: null
      }
    }
  }
}
