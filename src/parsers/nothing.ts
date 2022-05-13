import { type Parser } from '../state'

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
