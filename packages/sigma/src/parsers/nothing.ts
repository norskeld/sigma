import type { Parser } from '@types'

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
        start: pos,
        end: pos,
        pos,
        value: null,
      }
    },
  }
}
