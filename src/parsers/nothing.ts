import { success, type Parser } from '../state'

export function nothing(): Parser<null> {
  return {
    parse(state) {
      return success(state, null)
    }
  }
}
