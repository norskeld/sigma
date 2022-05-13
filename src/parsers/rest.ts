import { type Parser } from '../state'

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
