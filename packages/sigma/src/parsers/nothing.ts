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
        pos,
        value: null
      }
    }
  }
}
