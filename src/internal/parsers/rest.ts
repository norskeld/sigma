import { success, State, Parser } from '../state'

export function rest(): Parser<string> {
  return {
    parse(state: State) {
      return success(
        {
          text: state.text,
          index: state.text.length
        },
        state.text.substring(state.index)
      )
    }
  }
}
