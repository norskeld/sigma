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
    parse(_, pos) {
      return {
        isOk: false,
        span: [pos, pos],
        pos,
        expected
      }
    }
  }
}
