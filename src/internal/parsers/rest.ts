import { success, State, Parser } from '../state'

export function rest(): Parser<string> {
  return {
    parse(state: State) {
      const result = state.text.substring(state.index)

      const nextState: State = {
        text: state.text,
        index: state.text.length
      }

      return success(nextState, result)
    }
  }
}
