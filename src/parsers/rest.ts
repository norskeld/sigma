import { success, type Parser } from '../state'

export function rest(): Parser<string> {
  return {
    parse(state) {
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
