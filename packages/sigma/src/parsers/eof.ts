import type { Parser } from '@types'

/**
 * Only succeeds at the end of the input.
 *
 * @returns `null`
 */
export function eof(): Parser<null> {
  return {
    parse(ctx) {
      if (ctx.pos === ctx.input.length) {
        return null
      }

      return ctx.fail('end of input')
    },
  }
}
