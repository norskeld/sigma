import type { Parser } from '@state'

/**
 * Simply returns the unparsed input as a string. Never fails.
 *
 * @returns Rest of the input as a string
 */
export function rest(): Parser<string> {
  return {
    parse(input, pos) {
      return {
        isOk: true,
        pos: input.length,
        value: input.substring(pos)
      }
    }
  }
}
