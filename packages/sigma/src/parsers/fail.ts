import type { FailingParser } from '@types'

/**
 * Always fails with the given `expected` message, without consuming any input.
 *
 * @param expected - Failure message
 *
 * @returns Nothing, always fails
 */
export function fail(expected: string): FailingParser {
  return {
    parse(ctx) {
      return ctx.fail(expected)
    },
  }
}
