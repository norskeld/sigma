import type { SucceedingParser } from '@types'

/**
 * Simply returns the unparsed input as a string. Never fails.
 *
 * @returns Rest of the input as a string
 */
export function rest(): SucceedingParser<string> {
  return {
    parse(ctx) {
      const value = ctx.input.substring(ctx.pos)
      ctx.pos = ctx.input.length
      return value
    },
  }
}
