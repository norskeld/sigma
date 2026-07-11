import type { SucceedingParser } from '@types'

/**
 * Simply returns the unparsed input as a string. Never fails.
 *
 * @returns Rest of the input as a string
 */
export function rest(): SucceedingParser<string> {
  return {
    parse(input, pos) {
      return {
        isOk: true,
        start: pos,
        end: input.length,
        pos: input.length,
        value: input.substring(pos),
      }
    },
  }
}
