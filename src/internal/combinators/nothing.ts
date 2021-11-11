import { success, State, Parser } from '../state'

export function nothing(): Parser<null> {
  return {
    parse(state: State) {
      return success(state, null)
    }
  }
}

export { nothing as nil }
